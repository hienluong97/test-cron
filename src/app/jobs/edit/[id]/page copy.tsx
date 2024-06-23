"use client";

import React, { useState, useEffect } from "react";
import { Autocomplete, Box, TextField, InputLabel, LinearProgress, Typography } from "@mui/material";
import { Edit, useAutocomplete } from "@refinedev/mui";
import { useForm, Controller } from "react-hook-form";
import UploadImage from "@components/upload-image";
import { yupResolver } from "@hookform/resolvers/yup";
import { jobSchema } from "@validation/index";
import { supabaseClient } from "@utility/supabase-client";
import { OpenAIEmbeddings } from "@langchain/openai";

const fields = [
    "title",
    "job_category",
    "salary_lower",
    "salary_upper",
    "work_location",
    "description",
    "appeal_points",
    "desired_candidates",
    "outline",
    "company_id",
    "working_hours",
    "ocr_text",
    "job_status_id",
    "thumbnail",
];

export default function JobEdit() {
    const {
        saveButtonProps,
        refineCore: { queryResult, formLoading, onFinish },
        handleSubmit,
        register,
        control,
        formState: { errors, isDirty, dirtyFields },
    } = useForm({
        // resolver: yupResolver(jobSchema),
        refineCoreProps: {
            meta: {
                select: "*, job_statuses(id,name), companies(id,name, description)",
            },
        },
    });

    const jobData = queryResult?.data?.data;

    const { autocompleteProps: jobStatusAutocompleteProps } = useAutocomplete({
        resource: "job_statuses",
        defaultValue: jobData?.job_statuses?.id,
    });

    const { autocompleteProps: companyAutocompleteProps } = useAutocomplete({
        resource: "companies",
    });

    const handleSubmitForm = async (data) => {
        const {
            title,
            job_category,
            salary_lower,
            salary_upper,
            work_location,
            description,
            appeal_points,
            desired_candidates,
            selection_process,
            outline,
            company_name,
            working_hours,
            ocr_text,
            company_info,
        } = data;

        onFinish(data);

        // create vector
        const openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

        const openAIEmbeddings = new OpenAIEmbeddings({
            openAIApiKey: openAIApiKey,
        });

        const vectorText = [
            work_location,
            title,
            description,
            desired_candidates,
            job_category,
            appeal_points,
            outline,
            ocr_text,
        ].join(" ");

        try {
            const embedding = await openAIEmbeddings.embedQuery(vectorText);

            const { data: isJobVectorExist, error: checkJobVectorExistError } =
                await supabaseClient
                    .from("job_documents")
                    .select("*")
                    .eq("job_id", jobData?.id);

            if (checkJobVectorExistError) {
                throw new Error(JSON.stringify(checkJobVectorExistError));
            }

            const jobDocument = {
                embedding,
                content: vectorText,
            };

            if (isJobVectorExist && isJobVectorExist.length > 0) {
                const { error: updateJobVectorError } = await supabaseClient
                    .from("job_documents")
                    .update(jobDocument)
                    .eq("job_id", jobData?.id);

                if (updateJobVectorError) {
                    throw new Error(JSON.stringify(updateJobVectorError));
                }
            } else {
                const { error: insertJobVectorError } = await supabaseClient
                    .from("job_documents")
                    .insert({
                        job_id: jobData?.id,
                        ...jobDocument,
                    });

                if (insertJobVectorError) {
                    throw new Error(JSON.stringify(insertJobVectorError));
                }
            }

            return {
                success: true,
                successNotification: {
                    message: "求人の編集に成功しました。",
                },
            };
        } catch (error) {
            return {
                success: false,
                error: (error as Error).message,
            };
        }
    };

    // Calculate the completion rate
    const calculateCompletionRate = () => {
        const completedFields = fields.filter(field => dirtyFields[field]);
        return (completedFields.length / fields.length) * 100;
    };

    const completionRate = calculateCompletionRate();

    return (
        <Edit
            isLoading={formLoading}
            saveButtonProps={{ onClick: handleSubmit(handleSubmitForm) }}
        >
            <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column" }}
                autoComplete="off"
            >
                <Typography variant="h6" gutterBottom>
                    Form Completion Rate: {Math.round(completionRate)}%
                </Typography>
                <LinearProgress variant="determinate" value={completionRate} />
                <TextField
                    {...register("title")}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={"職名"}
                    name="title"
                />
                <TextField
                    {...register("job_category")}
                    error={!!errors.job_category}
                    helperText={errors.job_category?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={"求人カテゴリー"}
                    name="job_category"
                />
                <TextField
                    {...register("salary_lower", {
                        valueAsNumber: true,
                    })}
                    error={!!errors.salary_lower}
                    helperText={errors.salary_lower?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label={"最低給料"}
                    name="salary_lower"
                />
                <TextField
                    {...register("salary_upper", {
                        valueAsNumber: true,
                    })}
                    error={!!errors.salary_upper}
                    helperText={errors.salary_upper?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label={"最高給料"}
                    name="salary_upper"
                />
                <TextField
                    {...register("work_location")}
                    error={!!errors.work_location}
                    helperText={errors.work_location?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label={"通勤地"}
                    name="work_location"
                />
                <Controller
                    control={control}
                    name={"company_id"}
                    rules={{ required: "This field is required" }}
                    defaultValue={null}
                    render={({ field }) => (
                        <Autocomplete
                            id="company_id"
                            {...companyAutocompleteProps}
                            {...field}
                            onChange={(_, value) => {
                                field.onChange(value?.id);
                            }}
                            getOptionLabel={(item) => {
                                return (
                                    companyAutocompleteProps?.options?.find((p) => {
                                        const itemId =
                                            typeof item === "object"
                                                ? item?.id?.toString()
                                                : item?.toString();
                                        const pId = p?.id?.toString();
                                        return itemId === pId;
                                    })?.name ?? ""
                                );
                            }}
                            isOptionEqualToValue={(option, value) => {
                                const optionId = option?.id?.toString();
                                const valueId =
                                    typeof value === "object"
                                        ? value?.id?.toString()
                                        : value?.toString();
                                return value === undefined || optionId === valueId;
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={"企業"}
                                    margin="normal"
                                    variant="outlined"
                                    error={!!errors.companies?.id}
                                    helperText={errors.companies?.id?.message}
                                    required
                                />
                            )}
                        />
                    )}
                />
                <TextField
                    {...register("description")}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    multiline
                    label={"業務内容"}
                    name="description"
                    rows={4}
                />
                <TextField
                    {...register("appeal_points")}
                    error={!!errors.appeal_points}
                    helperText={errors.appeal_points?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    multiline
                    label={"アピールポイント"}
                    name="appeal_points"
                />
                <TextField
                    {...register("desired_candidates")}
                    error={!!errors.desired_candidates}
                    helperText={errors.desired_candidates?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    multiline
                    label={"求める人材像"}
                    name="desired_candidates"
                />
                <TextField
                    {...register("outline")}
                    error={!!errors.outline}
                    helperText={errors.outline?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    multiline
                    label={"概要"}
                    name="outline"
                />
                <TextField
                    {...register("working_hours")}
                    error={!!errors.working_hours}
                    helperText={errors.working_hours?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    multiline
                    label={"勤務時間"}
                    name="working_hours"
                />
                <TextField
                    {...register("ocr_text")}
                    error={!!errors.ocr_text}
                    helperText={errors.ocr_text?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    multiline
                    label={"OCRテキスト"}
                    name="ocr_text"
                />
                <Controller
                    control={control}
                    name={"job_status_id"}
                    rules={{ required: "This field is required" }}
                    defaultValue={null}
                    render={({ field }) => (
                        <Autocomplete
                            {...jobStatusAutocompleteProps}
                            {...field}
                            onChange={(_, value) => {
                                field.onChange(value?.id);
                            }}
                            getOptionLabel={(item) => {
                                return (
                                    jobStatusAutocompleteProps?.options?.find((p) => {
                                        const itemId =
                                            typeof item === "object"
                                                ? item?.id?.toString()
                                                : item?.toString();
                                        const pId = p?.id?.toString();
                                        return itemId === pId;
                                    })?.name ?? ""
                                );
                            }}
                            isOptionEqualToValue={(option, value) => {
                                const optionId = option?.id?.toString();
                                const valueId =
                                    typeof value === "object"
                                        ? value?.id?.toString()
                                        : value?.toString();
                                return value === undefined || optionId === valueId;
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={"ステータス"}
                                    margin="normal"
                                    variant="outlined"
                                    error={!!errors.job_statuses?.id}
                                    helperText={errors.job_statuses?.id?.message}
                                    required
                                />
                            )}
                        />
                    )}
                />
                <br />
                <br />
                <InputLabel>サムネイルアップロード </InputLabel>
                <Controller
                    control={control}
                    name="thumbnail"
                    render={({ field: { value, onChange, ...restField } }) => {
                        return (
                            <UploadImage
                                url={value}
                                size={{ width: 350, height: 250 }}
                                onUpload={(filePath) => {
                                    onChange({
                                        target: {
                                            value: filePath,
                                        },
                                    });
                                }}
                            />
                        );
                    }}
                />
            </Box>
        </Edit>
    );
}
