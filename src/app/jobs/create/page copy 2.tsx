"use client";

import { Autocomplete, Box, TextField, InputLabel } from "@mui/material";
import { Create, useAutocomplete } from "@refinedev/mui";
import { useCreate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import UploadImage from "@components/upload-image";
import { supabaseClient } from "@utility/supabase-client";
import { useNotification } from "@refinedev/core";
import { jobSchema } from "@validation/index";
import { yupResolver } from "@hookform/resolvers/yup";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createFilterOptions } from '@mui/material/Autocomplete';
import { useEffect, useState } from "react";
import Company from "@components/company";


export default function JobCreate() {
    // const { open } = useNotification();
    const filter = createFilterOptions();
    const [open, toggleOpen] = useState(false);
    const [dialogValue, setDialogValue] = useState({ name: "", domain_name: "", description: "" });
    const [value, setTheValue] = useState({ id:"", name: "", domain_name: "", description: "" });


    const { autocompleteProps: jobStatusAutocompleteProps } = useAutocomplete({
        resource: "job_statuses",
    });

    const { autocompleteProps: companyAutocompleteProps } = useAutocomplete({
        resource: "companies",}
      );

    

    const {
        saveButtonProps,
        refineCore: {
            queryResult,
            formLoading,
            onFinish,
            redirect,
        },
        handleSubmit,
        register,
        control,
        setValue,
        formState: { errors },
    } = useForm({
        // resolver: yupResolver(jobSchema),
    });


    const handleClose = () => {
        setDialogValue({
            name: '',
            domain_name: '',
            description: '',
        });
        toggleOpen(false);
    };



    const handleSubmitForm = async (data: any) => {
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

        try {
            const { data: job, error: insertJobError } = await supabaseClient
                .from("jobs")
                .insert(data)
                .select();

            if (insertJobError) {
                console.log("insertJobError"), insertJobError?.message;
            }

            const jobId = job?.[0]?.id;

            // open?.({
            //     type: "success",
            //     message: "求人の作成に成功しました。",
            //     description: "成功",
            //     key: jobId,
            // });

            redirect('list')

            // Create vector
            const openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY!;
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

            const embedding = await openAIEmbeddings.embedQuery(vectorText);

            const { error: insertJobVectorError } = await supabaseClient
                .from("job_documents")
                .insert({
                    job_id: jobId,
                    embedding: embedding,
                    content: vectorText,
                });

            if (insertJobError) {
                console.log("insertJobVectorError"), insertJobVectorError?.message;
            }

        } catch (error) {
            // open?.({
            //     type: "error",
            //     message: "求人の作成に失敗しました。",
            //     description: "失敗",
            // });
        }
    };


    return (
        <Create
            isLoading={formLoading}
            // saveButtonProps={saveButtonProps}
            saveButtonProps={{ onClick: handleSubmit(handleSubmitForm) }}
        >
            <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column" }}
                autoComplete="off"
            >
                <Controller
                    control={control}
                    name={"company_id"}
                    rules={{ required: "This field is required" }}
                    defaultValue={null as any}
                    render={({ field }) => (
                        <Autocomplete
                            id="company_id"  
                            {...companyAutocompleteProps}
                            {...field}
                            onChange={(event, newValue) => {
                                if (typeof newValue === 'string') {
                                    // timeout to avoid instant validation of the dialog's form.
                                    setTimeout(() => {
                                        toggleOpen(true);
                                        setDialogValue({
                                            name: newValue,
                                            domain_name: '',
                                            description: '',
                                        });
                                    });
                                } else if (newValue && newValue?.inputValue) {
                                    toggleOpen(true);
                                    setDialogValue({
                                        name: newValue?.inputValue,
                                        domain_name: '',
                                        description: '',
                                    });
                                    field.onChange(value?.id);
 
                                } else {
                                    field.onChange(newValue?.id);
                                    setValue("name", newValue?.name || "");
                                    setValue("domain_name", newValue?.domain_name || "");
                                    setValue("description", newValue?.description || "");
                                }
                            }}
                            getOptionLabel={(option) => {
                                // for example value selected with enter, right from the input
                                
                                if (typeof option === 'string') {
                                    return (
                                        companyAutocompleteProps?.options?.find((p) => {
                                            const optionId = option?.toString();
                                            const pId = p?.id?.toString();
                                            return optionId === pId;
                                        })?.name ?? ""
                                    );
                                }
                                if (option?.inputValue) {
                                    return option?.name;
                                }
                                return option?.name;
                            }}

                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);

                                if (params.inputValue !== '') {
                                    filtered.push({
                                        inputValue: params.inputValue,
                                        name: `Add "${params.inputValue}"`,
                                    });
                                }
                                return filtered;
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
                                    error={!!errors.company_id}
                                    // helperText={errors.company_id?.message}
                                    required
                                />
                            )}
                            freeSolo
                            value={value}
                        />
                    )}
                />
                <TextField
                    {...register("name")}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label={"Company Name"}
                    name="name"
                    disabled
                    // value={value?.name}
                />
                <TextField
                    {...register("domain_name")}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label={"Domain Name"}
                    name="domain_name"
                    disabled
                    // value={value?.domain_name}
                />
                <TextField
                    {...register("description")}
                    error={!!errors.description}
                    // helperText={errors.description?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    multiline
                    label={"業務内容"}
                    name="description"
                    rows={4}
                    // value={value?.description}
                />

                <Company 
                    handleClose={handleClose}
                    dialogValue={dialogValue}
                    openForm={open} 
                    setTheValue={setTheValue}
                    handleAddNewCompanySubmit={handleAddNewCompanySubmit}
                    />
            </Box>
        </Create>
    );
}
