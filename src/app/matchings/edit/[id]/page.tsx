"use client";

import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  TextField,
  InputLabel,
} from "@mui/material";
import { Edit, useAutocomplete } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import UploadImage from "@components/upload-image";
import { yupResolver } from "@hookform/resolvers/yup";
import { companySchema } from "@validation/index";
import { useBack } from "@refinedev/core";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";

export default function MatchingEdit() {
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading, onFinish },
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      meta: {
        select: "*",
      },
      autoSave: {
        enabled: false,
      },
    },
  });



  return (
    <Edit
      saveButtonProps={saveButtonProps}
    >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column" }}
          autoComplete="off"
        >
          <TextField
            {...register("id")}
            required
            error={!!(errors as any)?.name}
            helperText={(errors as any)?.name?.message}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={"企業名"}
            name="name"
          />
          <TextField
            {...register("user_id")}
            error={!!(errors as any)?.user_id}
            helperText={(errors as any)?.user_id?.message}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            type="text"
            label={"user_id"}
            name="user_id"
          />
          <TextField
            {...register("job_id")}
            error={!!(errors as any)?.job_id}
            helperText={(errors as any)?.job_id?.message}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            type="text"
            label={"job_id"}
            name="job_id"
          />
          <TextField
            {...register("score")}
            error={!!(errors as any)?.score}
            helperText={(errors as any)?.score?.message}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={"score"}
            name="score"
          />
        </Box>
      </Box>
    </Edit>
  );
}
