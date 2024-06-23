"use client";

import {
    Autocomplete,
    Box,
    TextField,
    InputLabel,
    LinearProgress,
    Typography,
  } from "@mui/material";
import { Edit, useAutocomplete } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import UploadImage from "@components/upload-image";
import { OpenAIEmbeddings } from "@langchain/openai";
import { supabaseClient } from "@utility/supabase-client";
import { jobSchema } from "@validation/index";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";

type JobFormFields = {
    title: string;
    job_category: string;
    salary_lower: number;
    salary_upper: number;
    work_location: string;
    description: string;
    appeal_points: string;
    desired_candidates: string;
    outline: string;
    company_id: string;
    working_hours: string;
    ocr_text: string;
    job_status_id: string;
    thumbnail: string;
  };
  
  const fields: (keyof JobFormFields)[] = [
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
      watch,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(jobSchema),
      refineCoreProps: {
        meta: {
          select: "*, job_statuses(id,name), companies(id,name, description)",
        },
      },
    });

    const jobData = queryResult?.data?.data;

    const { autocompleteProps: jobStatusAutocompleteProps } = useAutocomplete({
        resource: "job_statuses",
        defaultValue: jobData?.job_statuses?.id
    });

    const { autocompleteProps: companyAutocompleteProps } = useAutocomplete({
        resource: "companies",
    });

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
    
        onFinish(data);
    
        // create vector
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

    // const watchAllFields = watch() 
    // Calculate the completion rate including default values
  const calculateCompletionRate = () => {
    const watchAllFields = watch() 
    const filterNonNullValues = (obj: { [key: string]: any }): any[] => {
        return Object.values(obj).filter(value => value !== null && value !== "");
      };
    
      // Using the function
      const nonNullValues = filterNonNullValues(watchAllFields);

  const numFieldsInForm = Object.keys(watchAllFields).length;

  console.log("watchAllFields", watchAllFields,  nonNullValues?.length )
  console.log("all", numFieldsInForm )

    return (nonNullValues?.length / numFieldsInForm) * 100;

  };
  const [completionRate, setCompletionRate] = useState(calculateCompletionRate());

  useEffect(() => {
    const subscription = watch(() => {
      setCompletionRate(calculateCompletionRate());
    });
    return () => subscription.unsubscribe();
  }, [watch]);
    


    return (
      <Edit
        isLoading={formLoading}
        // saveButtonProps={saveButtonProps}
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
            error={!!(errors as any)?.title}
            helperText={(errors as any)?.title?.message}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={"職名"}
            name="title"
          />
          <TextField
            {...register("job_category")}
            error={!!(errors as any)?.job_category}
            helperText={(errors as any)?.job_category?.message}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={"求人カテゴリー"}
            name="job_category"
          />

          <TextField
            {...register("salary_upper", {
              valueAsNumber: true,
            })}
            error={!!(errors as any)?.content}
            helperText={(errors as any)?.content?.message}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            multiline
            label={"最低給料"}
            name="salary_lower"
          />
          <TextField
            {...register("salary_upper", {
              valueAsNumber: true,
            })}
            error={!!(errors as any)?.content}
            helperText={(errors as any)?.content?.message}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            multiline
            label={"最高給料"}
            name="salary_upper"
          />
          <TextField
            {...register("work_location")}
            error={!!(errors as any)?.content}
            helperText={(errors as any)?.content?.message}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            multiline
            label={"通勤地"}
            name="work_location"
          />
          <Controller
            control={control}
            name={"company_id"}
            rules={{ required: "This field is required" }}
            // eslint-disable-next-line
            defaultValue={null as any}
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
                    error={!!(errors as any)?.companies?.id}
                    helperText={(errors as any)?.companies?.id?.message}
                    required
                  />
                )}
              />
            )}
          />
          <TextField
            {...register("description")}
            error={!!(errors as any)?.description}
            helperText={(errors as any)?.description?.message}
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
            error={!!(errors as any)?.appeal_points}
            helperText={(errors as any)?.appeal_points?.message}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            multiline
            label={"アピールポイント"}
            name="appeal_points"
          />
          <TextField
            {...register("desired_candidates")}
            error={!!(errors as any)?.desired_candidates}
            helperText={(errors as any)?.desired_candidates?.message}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            multiline
            label={"求める人材像"}
            name="desired_candidates"
          />
          <TextField
            {...register("outline")}
            error={!!(errors as any)?.outline}
            helperText={(errors as any)?.outline?.message}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            multiline
            label={"概要"}
            name="outline"
          />
          <TextField
            {...register("working_hours")}
            error={!!(errors as any)?.working_hours}
            helperText={(errors as any)?.working_hours?.message}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            multiline
            label={"勤務時間"}
            name="working_hours"
          />
          <TextField
            {...register("ocr_text")}
            error={!!(errors as any)?.ocr_text}
            helperText={(errors as any)?.ocr_text?.message}
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
            // eslint-disable-next-line
            defaultValue={null as any}
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
                    error={!!(errors as any)?.job_statuses?.id}
                    helperText={(errors as any)?.job_statuses?.id?.message}
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
