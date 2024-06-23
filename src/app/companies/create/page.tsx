"use client";

import React, { useCallback } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';

// Define the validation schema using Yup
const singleCompanySchema = yup.object().shape({
  name: yup.string().required('企業名は必須です'),
  website: yup.string().url('有効なURLを入力してください').required('サイトは必須です'),
});

export const companySchema = yup.object().shape({
  companies: yup.array().of(singleCompanySchema),
});

export default function CompanyCreate() {
  const methods = useForm({
    resolver: yupResolver(companySchema),
  });

  const {
    control,
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = methods;

  const { fields, append } = useFieldArray({
    control,
    name: "companies"
  });

  const handleDuplicate = () => {
    const currentValues = getValues();

    // Ensure currentValues.companies is defined and is an array
    if (currentValues.companies && Array.isArray(currentValues.companies)) {
      // Get the last item to duplicate
      const lastItem = currentValues.companies[currentValues.companies.length - 1];
      append({ ...lastItem });
    }
  };

  const onSubmit = (data: any) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <Create>
      <FormProvider {...methods}>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column" }}
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          {fields.map((item, index) => (
            <Box key={item.id} sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Title {index + 1}
              </Typography>
              <TextField
                {...register(`companies.${index}.name`)}
                error={!!errors?.companies?.[index]?.name}
                helperText={errors?.companies?.[index]?.name?.message}
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }}
                type="text"
                label={"企業名"}
                name={`companies.${index}.name`}
              />
              <TextField
                {...register(`companies.${index}.website`)}
                error={!!errors?.companies?.[index]?.website}
                helperText={errors?.companies?.[index]?.website?.message}
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }}
                type="text"
                label={"サイト"}
                name={`companies.${index}.website`}
              />
            </Box>
          ))}
          <Button variant="contained" onClick={handleDuplicate} sx={{ mb: 2 }}>
            Duplicate
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </FormProvider>
    </Create>
  );
}
