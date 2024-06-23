"use client";

import {
  Box,
  TextField,
  InputLabel,
} from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import UploadImage from "@components/upload-image";


export default function MatchingCreate() {
  const {
    saveButtonProps,
    refineCore: { formLoading, onFinish },
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
  });

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
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
    </Create>
  );
}
