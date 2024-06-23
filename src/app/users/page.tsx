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
  TextFieldComponent as TextField,
} from "@refinedev/mui";
import React from "react";
import { useGetIdentity } from "@refinedev/core";
import { useOne, HttpError } from "@refinedev/core";
import { supabaseAdmin } from "@utility/supabase-client";

export default function UserList() {
  const { dataGridProps } = useDataGrid({
    syncWithLocation: true,
    meta: {
      select: "*, user_types(id, name)",
    },
    filters: {
      permanent: [
        {
          field: "user_type_id",
          operator: "eq",
          value: 3,
        },
      ],
    },
  });

  const { data: userData, isLoading: userLoading } = useMany({
    resource: "user_types",
    ids:
      dataGridProps?.rows
        ?.map((item: any) => item?.user_types?.id)
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
        field: "first_name",
        flex: 1,
        headerName: "名",
        minWidth: 120,
      },
      //   {
      //     field: "last_name",
      //     flex: 1,
      //     headerName: "姓",
      //     minWidth: 120,
      //   },
      //   {
      //     field: "first_kana",
      //     flex: 1,
      //     headerName: "名（カナ）",
      //     minWidth: 120,
      //   },
      //   {
      //     field: "last_kana",
      //     flex: 1,
      //     headerName: "姓（カナ）",
      //     minWidth: 120,
      //   },
      {
        field: "gender",
        flex: 1,
        headerName: "性別",
        minWidth: 150,
        renderCell: function render({ value }) {
          if (value) {
            return <TextField value={value} />;
          } else return <p>未入力</p>;
        },
      },
      {
        field: "birthday",
        flex: 1,
        headerName: "生年月日",
        minWidth: 120,
        renderCell: function render({ value }) {
          if (value) {
            return <DateField value={value} />;
          } else return <p>未入力</p>;
        },
      },
      {
        field: "postal_code",
        flex: 1,
        headerName: "郵便番号",
        minWidth: 150,
        renderCell: function render({ value }) {
          if (value) {
            return <TextField value={value} />;
          } else return <p>未入力</p>;
        },
      },
      {
        field: "address",
        flex: 1,
        headerName: "住所",
        minWidth: 150,
        renderCell: function render({ value }) {
          if (value) {
            return <TextField value={value} />;
          } else return <p>未入力</p>;
        },
      },
      {
        field: "phone",
        flex: 1,
        headerName: "電話番号",
        minWidth: 150,
        renderCell: function render({ value }) {
          if (value) {
            return <TextField value={value} />;
          } else return <p>未入力</p>;
        },
      },
      {
        field: "introduction",
        flex: 1,
        headerName: "自己紹介",
        minWidth: 200,
        renderCell: function render({ value }) {
          if (value) {
            return <TextField value={value} />;
          } else return <p>未入力</p>;
        },
      },
      {
        field: "pr_skill",
        flex: 1,
        headerName: "スキルPR",
        minWidth: 200,
        renderCell: function render({ value }) {
          if(value) {
             const userSkills = JSON.parse(value);
             return <TextField value={userSkills?.self_promotion} />;
          } else return <p>未入力</p>;
        },
      },
      {
        field: "pr_relationship",
        flex: 1,
        headerName: "人間関係PR",
        minWidth: 200,
        renderCell: function render({ value }) {
          if (value) {
            return <TextField value={value} />;
          } else return <p>未入力</p>;
        },
      },
      {
        field: "pr_adaptation",
        flex: 1,
        headerName: "適応力PR",
        minWidth: 200,
        renderCell: function render({ value }) {
          if (value) {
            return <TextField value={value} />;
          } else return <p>未入力</p>;
        },
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
              <DeleteButton hideText recordItemId={row.id} 
                onSuccess={ async () => {
                  await supabaseAdmin.auth.admin.deleteUser(row.id);
                }}
              />
            </>
          );
        },
        align: "center",
        headerAlign: "center",
        minWidth: 80,
      },
    ],
    [userData]
  );

  const { data: identity } = useGetIdentity<IIdentity>();
  type IIdentity = {
      id: number;
      fullName: string;
      role: string
    };
  const { data, isLoading, isError } = useOne<any, HttpError>({
      resource: "users",
      id: identity?.id
    });
  
  const currentUserRole: any = data?.data?.role


  return ( 
    <List canCreate={currentUserRole === "応募者" ? false : true} >
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
      />
    </List>
  );
}
