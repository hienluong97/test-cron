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

export default function CompanyEdit() {
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
    resolver: yupResolver(companySchema),
  });

  const companyData = queryResult?.data?.data;

  const { autocompleteProps: companyAutocompleteProps } = useAutocomplete({
    resource: "companies",
    defaultValue: companyData?.companies?.id,
  });

  const back = useBack();

  return (
    <Edit
      goBack={
        <IconButton {...saveButtonProps}>
          <ArrowBackIcon />
        </IconButton>
      }
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
      headerButtons={({ refreshButtonProps }) => (
        <Button
          //  variant="contained"
          {...saveButtonProps}
          startIcon={<ListOutlinedIcon />}
        >
          企業リスト
        </Button>
      )}
    >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("name")}
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
          {...register("website")}
          error={!!(errors as any)?.website}
          helperText={(errors as any)?.website?.message}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"サイト"}
          name="website"
        />
        <TextField
          {...register("phone")}
          error={!!(errors as any)?.phone}
          helperText={(errors as any)?.phone?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"電話番号"}
          name="phone"
        />

        <TextField
          {...register("email")}
          error={!!(errors as any)?.email}
          helperText={(errors as any)?.email?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"メールアドレス"}
          name="email"
        />
        <TextField
          {...register("description")}
          error={!!(errors as any)?.description}
          helperText={(errors as any)?.description?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          multiline
          label={"企業の説明"}
          name="description"
          rows={4}
        />
        <TextField
          {...register("address")}
          error={!!(errors as any)?.address}
          helperText={(errors as any)?.address?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"アドレス"}
          name="address"
        />

        <TextField
          {...register("domain_name")}
          error={!!(errors as any)?.domain_name}
          helperText={(errors as any)?.domain_name?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"ドメイン名"}
          name="domain_name"
        />
        <TextField
          {...register("domain_alias")}
          error={!!(errors as any)?.domain_alias}
          helperText={(errors as any)?.domain_alias?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"ドメインエイリアス"}
          name="domain_alias"
        />

        <TextField
          {...register("ga_tag")}
          error={!!(errors as any)?.ga_tag}
          helperText={(errors as any)?.ga_tag?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"Ga Tag"}
          name="ga_tag"
        />

        <TextField
          {...register("gtm_tag")}
          error={!!(errors as any)?.gtm_tag}
          helperText={(errors as any)?.gtm_tag?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"Gtm Tag"}
          name="gtm_tag"
        />

        <TextField
          {...register("policy")}
          error={!!(errors as any)?.policy}
          helperText={(errors as any)?.policy?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"ポリシー"}
          name="policy"
        />

        <TextField
          {...register("slug")}
          error={!!(errors as any)?.slug}
          helperText={(errors as any)?.slug?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"スラッグ"}
          name="slug"
        />
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

        <br />

        <InputLabel>ファビコンアップロード</InputLabel>
        <Controller
          control={control}
          name="favicon"
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
        <br />

        <InputLabel>ロゴ画像アップロード</InputLabel>
        <Controller
          control={control}
          name="img_logo"
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
        <br />
        <InputLabel>カバー画像アップロード</InputLabel>
        <Controller
          control={control}
          name="img_cover"
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
        <br />
      </Box>
    </Edit>
  );
}
