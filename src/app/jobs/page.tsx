"use client";

import {
    DataGrid,
    GridColDef,
} from "@mui/x-data-grid";
import { useMany } from "@refinedev/core";
import {
    DateField,
    DeleteButton,
    EditButton,
    List,
    MarkdownField,
    ShowButton,
    useDataGrid,
    useAutocomplete,
} from "@refinedev/mui";
import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { useForm, Controller } from "react-hook-form"
import {
    CrudFilters,
    getDefaultFilter,
    HttpError
} from "@refinedev/core";
import RenderImage from "@components/render-image";
import { Job, JobFilterVariables,  Nullable } from "@interfaces/index";



export default function JobList() {
  const { dataGridProps, filters, search } = useDataGrid<
    Job,
    HttpError,
    JobFilterVariables
  >({
    syncWithLocation: true,
    meta: {
      select: "*, job_statuses(id,name), companies(id,name)",
    },
    initialPageSize: 25,
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { title, job_status_id } = params;

      filters.push(
        {
          field: "title",
          operator: "contains",
          value: title,
        },
        {
          field: "job_status_id",
          operator: "eq",
          value: job_status_id !== "" ? job_status_id : undefined,
        }
      );
      return filters;
    },
  });

  const { data: statusData, isLoading: statusIsLoading } = useMany({
    resource: "job_statuses",
    ids:
      dataGridProps?.rows
        ?.map((item: any) => item?.job_status_id)
        .filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
    },
  });

  const { data: companyData, isLoading: companyIsLoading } = useMany({
    resource: "companies",
    ids:
      dataGridProps?.rows
        ?.map((item: any) => item?.company_id)
        .filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
    },
  });


  const columns = React.useMemo<GridColDef<Job>[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        type: "number",
        minWidth: 50,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "title",
        flex: 1,
        headerName: "職名",
        minWidth: 200,
      },
      {
        field: "job_category",
        flex: 1,
        headerName: "求人カテゴリー",
        minWidth: 200,
      },
      {
        field: "salary_lower",
        flex: 1,
        headerName: "給料",
        minWidth: 80,
        maxWidth: 120,
        valueGetter: ({ value }) => {
          if (value) {
            return `${value} ~`;
          } else {
            return "未入力";
          }
        },
      },
      {
        field: "salary_upper",
        flex: 1,
        headerName: "",
        minWidth: 100,
        maxWidth: 120,
        valueGetter: ({ value }) => {
          if (value) {
            return value;
          } else {
            return "未入力";
          }
        },
      },
      {
        field: "work_location",
        flex: 1,
        headerName: "勤務地",
        minWidth: 200,
      },
      {
        field: "job_status_id",
        flex: 1,
        headerName: "ステータス",
        minWidth: 300,
        valueGetter: ({ row }) => {
          const value = row?.job_statuses;
          return value;
        },
        renderCell: function render({ value }) {
          return statusIsLoading ? (
            <>Loading...</>
          ) : (
            statusData?.data?.find((item) => item.id === value?.id)?.name
          );
        },
      },
      {
        field: "description",
        flex: 1,
        headerName: "業務内容",
        minWidth: 200,
      },
      {
        field: "appeal_points",
        flex: 1,
        headerName: "アピールポイント",
        minWidth: 200,
      },
      {
        field: "desired_candidates",
        flex: 1,
        headerName: "求める人材像",
        minWidth: 200,
      },
      {
        field: "selection_process",
        flex: 1,
        headerName: "選考プロセス",
        minWidth: 200,
      },
      {
        field: "outline",
        flex: 1,
        headerName: "概要",
        minWidth: 200,
      },
      {
        field: "thumbnail",
        flex: 1,
        headerName: "サムネイル",
        minWidth: 100,
        renderCell: function render({ value }) {
          return <RenderImage url={value} size={{ width: 50, height: 50 }} />;
        },
      },
      {
        field: "company_name",
        flex: 1,
        headerName: "企業名",
        minWidth: 200,
        valueGetter: ({ row }) => {
          const value = row?.companies;
          return value;
        },
        renderCell: function render({ value }) {
          return companyIsLoading ? (
            <>Loading...</>
          ) : (
            companyData?.data?.find((item) => item.id === value?.id)?.name
          );
        },
      },
      {
        field: "working_hours",
        flex: 1,
        headerName: "勤務時間",
        minWidth: 200,
      },
      {
        field: "ocr_text",
        flex: 1,
        headerName: "OCRテキスト",
        minWidth: 200,
      },
      {
        field: "company_info",
        flex: 1,
        headerName: "企業情報",
        minWidth: 200,
      },
      {
        field: "createdAt",
        flex: 1,
        headerName: "作成日",
        sortable: true,
        minWidth: 250,
        renderCell: function render({ value }) {
          return <DateField value={value} />;
        },
      },
      {
        field: "actions",
        headerName: "操作",
        sortable: false,
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
              <DeleteButton hideText recordItemId={row.id} />
            </>
          );
        },
        align: "center",
        headerAlign: "center",
        minWidth: 80,
      },
    ],
    [statusData, statusIsLoading]
  );

  const { autocompleteProps } = useAutocomplete({
    resource: "job_statuses",
    defaultValue: getDefaultFilter("job_status_id", filters, "eq"),
  });


  const { control, register, handleSubmit, watch } = useForm<
    Job,
    HttpError,
    Nullable<JobFilterVariables>
  >({
    defaultValues: {
        title: getDefaultFilter("title", filters, "contains"),
      job_status_id: getDefaultFilter("job_status_id", filters, "eq"),
    },
  });

  const title = watch('title');
  const job_status_id = watch('job_status_id');

  useEffect(()=> {
    search({title , job_status_id });
  }, [title, job_status_id])

  return (
    <>
      <Grid item xs={12} lg={3} sx={{ marginBottom: "60px" }}>
        <Card sx={{ paddingX: { xs: 2, md: 0 } }}>
          <CardHeader title="Filters" />
          <CardContent sx={{ pt: 0 }}>
            <Box
              component="form"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
              }}
              autoComplete="off"
              onSubmit={handleSubmit(search)}
            >
              <TextField
                {...register("title")}
                id="title"
                // label="Search"
                placeholder="タイトル"
                margin="normal"
                fullWidth
                autoFocus
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined />
                    </InputAdornment>
                  ),
                }}
              />
              <Controller
                control={control}
                name="job_status_id"
                render={({ field }) => (
                  <Autocomplete
                    id="job_status_id"
                    {...autocompleteProps}
                    {...field}
                    onChange={(_, value) => {
                      field.onChange(value?.id ?? value);
                    }}
                    getOptionLabel={(item) => {
                      return item.name
                        ? item.name
                        : autocompleteProps?.options?.find(
                            (p) => p.id.toString() === item.toString()
                          )?.name ?? "";
                    }}
                    isOptionEqualToValue={(option, value) =>
                      value === undefined ||
                      option?.id?.toString() ===
                        (value?.id ?? value)?.toString()
                    }
                    value={field.value || null}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="ステタス"
                        placeholder=""
                        margin="normal"
                        variant="outlined"
                        size="small"
                        sx={{
                          minWidth: "300px",
                        }}
                      />
                    )}
                  />
                )}
              />
              <br />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  margin: "16px 0 8px 0",
                }}
              >
                適用
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <List
        headerButtons={({ createButtonProps }) => (
          <Button
            href="/jobs/create"
            {...createButtonProps}
            variant="contained"
          >
            求人新規作成
          </Button>
        )}
      >
        <DataGrid
          {...dataGridProps}
          columns={columns}
          autoHeight
          disableColumnFilter={true}
          filterModel={undefined}
        //   slotProps={{
        //     pagination: {
        //       labelRowsPerPage: "行/ページ",
        //     },
        //   }}
        />
      </List>
    </>
  );
}

