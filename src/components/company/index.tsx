"use client";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { Autocomplete, Box, Button, Select, TextField } from "@mui/material";
import { Create } from "@refinedev/mui";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { supabaseClient, supabaseAdmin } from "@utility/supabase-client";
import { useNotification } from "@refinedev/core";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

type CompanyFormProps = {
  handleClose: any;
  dialogValue: any;
  openForm: boolean;
  setValue: any,
};

export default function Company({
  dialogValue,
  handleClose,
  openForm,
  setValue,
}: CompanyFormProps) {

  const {name, domain_name, description } = dialogValue
  const { open: openNoti } = useNotification();


  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    // resolver: yupResolver(createEducationSchema),
  });

  const handleAddNewCompanySubmit = async (data : any) => {

    const { data: insertCompany, error: insertCompanyError } =
        await supabaseClient
            .from("companies")
            .insert({ 
                name: data?.name, 
                domain_name: data?.domain_name, 
                description: data?.description  })
            .select();
    const company = insertCompany?.[0];

    if (!insertCompanyError) {
        setValue({
            id: company?.id,
            name: company?.name,
            description: company?.description,
        })
        openNoti?.({
            type: "success",
            message: "Companyの作成に成功しました。",
            description: "成功",
        });

        handleClose();
    } else {
        openNoti?.({
            type: "error",
            message: "Companyの作成に失敗しました。",
            description: "失敗",
        });
        return {
            success: false,
            error: JSON.parse(JSON.stringify(insertCompanyError)),
        };
    }
};


  return (
    <BootstrapDialog
      open={openForm}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      maxWidth="md"
      fullWidth={true}
      // sx={{ minWidth: "1200px", }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        company
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Box component="div">
          <TextField
            {...register("name")}
            error={!!(errors as any)?.name}
            helperText={(errors as any)?.name?.message}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={"name"}
            name="name"
            defaultValue={name}
          />
          <TextField
            {...register("domain_name")}
            error={!!(errors as any)?.domain_name}
            helperText={(errors as any)?.domain_name?.message}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={"domain_name"}
            name="domain_name"
          />
          <TextField
            {...register("description")}
            error={!!(errors as any)?.description}
            helperText={(errors as any)?.description?.message}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={"description"}
            name="description"
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit(handleAddNewCompanySubmit)}>
          Save
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}

export const createEducationSchema = yup
  .object({
    name: yup.string().required(),
    faculty: yup.string().notRequired(),
    major: yup.string().notRequired(),
    graduation_year: yup.number().notRequired(),
  })
  .required();
