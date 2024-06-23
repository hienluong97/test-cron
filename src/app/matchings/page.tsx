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




export default function MatchingList() {
  const { dataGridProps } = useDataGrid({
    syncWithLocation: true,
    meta: {
      select: "*",
    },
  });

  const { data: matchingData, isLoading: matchingIsLoading } = useMany({
    resource: "matchings",
    ids:
      dataGridProps?.rows
        ?.map((item: any) => item?.matchings?.id)
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
        field: "user_id",
        flex: 1,
        headerName: "user_id",
        minWidth: 200,
      },
      {
        field: "job_id",
        flex: 1,
        headerName: "job_id",
        minWidth: 200,
      },
      {
        field: "score",
        flex: 1,
        headerName: "Score",
        minWidth: 100,
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
    [matchingData]
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
}
