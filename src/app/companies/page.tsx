"use client";
import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMany } from "@refinedev/core";
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  MarkdownField,
  ShowButton,
  useDataGrid,
  BooleanField,
} from "@refinedev/mui";
import { Checkbox } from "@mui/material";
import RenderImage from "@components/render-image";



export default function CompanyList() {
  const { dataGridProps } = useDataGrid({
    syncWithLocation: true,
    meta: {
      select: "*",
    },
  });

  const { data: companyData, isLoading: companyIsLoading } = useMany({
    resource: "companies",
    ids:
      dataGridProps?.rows
        ?.map((item: any) => item?.companies?.id)
        .filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
    },
  });

  const columns = React.useMemo<GridColDef[]>(
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
        field: "name",
        flex: 1,
        headerName: "企業名",
        minWidth: 200,
      },
      {
        field: "website",
        flex: 1,
        headerName: "サイト",
        minWidth: 100,
      },
      {
        field: "phone",
        flex: 1,
        headerName: "電話番号",
        minWidth: 200,
      },
      {
        field: "email",
        flex: 1,
        headerName: "メールアドレス",
        minWidth: 200,
      },
      {
        field: "description",
        flex: 1,
        headerName: "企業の説明",
        minWidth: 200,
      },
      {
        field: "address",
        flex: 1,
        headerName: "アドレス",
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
        field: "favicon",
        flex: 1,
        headerName: "ファビコン",
        minWidth: 100,
        renderCell: function render({ value }) {
          return <RenderImage url={value} size={{ width: 50, height: 50 }} />;
        },
      },
      {
        field: "img_logo",
        flex: 1,
        headerName: "ロゴ画像",
        minWidth: 200,
        renderCell: function render({ value }) {
          return <RenderImage url={value} size={{ width: 50, height: 50 }} />;
        },
      },
      {
        field: "img_cover",
        flex: 1,
        headerName: "カバー画像",
        minWidth: 200,
        renderCell: function render({ value }) {
          return <RenderImage url={value} size={{ width: 50, height: 50 }} />;
        },
      },
      {
        field: "is_public",
        headerName: "公開",
        minWidth: 100,
        renderCell: function render({ value }) {
          return (
            <BooleanField
              value={value}
              trueIcon={<Checkbox checked />}
              falseIcon={<Checkbox disabled />}
              valueLabelTrue="Public"
              valueLabelFalse="Unpublish"
            />
          );
        },
      },
      {
        field: "domain_name",
        flex: 1,
        headerName: "ドメイン名",
        minWidth: 200,
      },
      {
        field: "domain_alias",
        flex: 1,
        headerName: "ドメインエイリアス",
        minWidth: 200,
      },
      {
        field: "ga_tag",
        flex: 1,
        headerName: "Ga Tag",
        minWidth: 200,
      },
      {
        field: "gtm_tag",
        flex: 1,
        headerName: "Gtm Tag",
        minWidth: 200,
      },
      {
        field: "policy",
        flex: 1,
        headerName: "ポリシー",
        minWidth: 200,
      },
      {
        field: "slug",
        flex: 1,
        headerName: "スラッグ",
        minWidth: 200,
      },
      {
        field: "createdAt",
        flex: 1,
        headerName: "作成日時",
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
    [companyData]
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
}
