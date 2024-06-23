'use client'
import React, { useState, useEffect } from "react";
import WorkIcon from '@mui/icons-material/Work';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import GroupIcon from '@mui/icons-material/Group';
import JoinInnerIcon from '@mui/icons-material/JoinInner';
import Link from "next/link";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import { supabaseClient } from "@utility/supabase-client";
import { useList, HttpError } from "@refinedev/core";
import { Job } from "@interfaces";

const CategoryList = () => {

    const { data: jobData, isLoading: jobLoading, isError: getJobError } = useList<Job, HttpError>({
        resource: "jobs",
    });
    const jobNumber = jobData?.data?.length;

    const {
        data: companyData,
        isLoading: companyLoading,
        isError: getCompanyError,
    } = useList<Job, HttpError>({
        resource: "companies",
    });
    const companyNumber = companyData?.data?.length;

    const {
      data: userData,
      isLoading: userLoading,
      isError: getUserError,
    } = useList<any, HttpError>({
      resource: "users",
      filters: [
        {
          field: "user_type_id",
          operator: "eq",
          value: 3,
        },
      ],
    });
    const userNumber = userData?.data?.length;

    const {
        data: matchingData,
        isLoading: matchingLoading,
        isError: getMatchingError,
    } = useList<any, HttpError>({
        resource: "matchings",
    });
    const matchingNumber = matchingData?.data?.length;



    return (
        <>
            <Grid item xs={12} lg={3} sx={{ paddingBottom: "160px" }}>
                <Card sx={{ padding: { xs: 0, md: 2 } }}>
                    <CardHeader
                        title="ダッシュボード"
                        sx={{ paddingY: { xs: 4, md: 6 } }}
                    />
                    <CardContent sx={{ pt: 0 }}>
                        <Box
                            component="div"
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "24px",
                                width: "100%",
                            }}
                        >
                            <Box
                                component="div"
                                sx={{
                                    p: 1,
                                    border: "1px solid rgba(0, 0, 0, 0.12)",
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "12px",
                                }}
                            >
                                <Box
                                    component="div"
                                    sx={{
                                        p: 1,
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: "16px",
                                    }}
                                >
                                    <WorkIcon aria-hidden="true" />
                                    <Box component="div">
                                        <Box component="div">
                                            <span>新着の求人数</span>
                                        </Box>
                                        <Box component="div">
                                            <span>
                                                {jobNumber}
                                                <small>件</small>
                                            </span>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box component="div" sx={{ p: 1 }}>
                                    <Link href="/jobs">求人一覧</Link>
                                </Box>
                            </Box>
                            <Box
                                component="div"
                                sx={{
                                    p: 1,
                                    border: "1px solid rgba(0, 0, 0, 0.12)",
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "12px",
                                }}
                            >
                                <Box
                                    component="div"
                                    sx={{
                                        p: 1,
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: "16px",
                                    }}
                                >
                                    <HomeWorkIcon aria-hidden="true" />
                                    <Box component="div">
                                        <Box component="div">
                                            <span>新着の企業数</span>
                                        </Box>
                                        <Box component="div">
                                            <span>
                                                {companyNumber}
                                                <small>件</small>
                                            </span>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box component="div" sx={{ p: 1 }}>
                                    <Link href="/companies">企業一覧</Link>
                                </Box>
                            </Box>
                            <Box
                                component="div"
                                sx={{
                                    p: 1,
                                    border: "1px solid rgba(0, 0, 0, 0.12)",
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "12px",
                                }}
                            >
                                <Box
                                    component="div"
                                    sx={{
                                        p: 1,
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: "16px",
                                    }}
                                >
                                    <GroupIcon aria-hidden="true" />
                                    <Box component="div">
                                        <Box component="div">
                                            <span>新着の応募数</span>
                                        </Box>
                                        <Box component="div">
                                            <span>
                                                {userNumber} <small>件</small>
                                            </span>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box component="div" sx={{ p: 1 }}>
                                    <Link href="/users">応募数一覧</Link>
                                </Box>
                            </Box>
                            <Box
                                component="div"
                                sx={{
                                    p: 1,
                                    border: "1px solid rgba(0, 0, 0, 0.12)",
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "12px",
                                }}
                            >
                                <Box
                                    component="div"
                                    sx={{
                                        p: 1,
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: "16px",
                                    }}
                                >
                                    <JoinInnerIcon aria-hidden="true" />
                                    <Box component="div">
                                        <Box component="div">
                                            <span>新着のマッチング数</span>
                                        </Box>
                                        <Box component="div">
                                            <span>
                                                {matchingNumber} <small>件</small>
                                            </span>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box component="div" sx={{ p: 1 }}>
                                    <Link href="/matchings">マッチング一覧</Link>
                                </Box>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </>
    );
};

export default CategoryList;
