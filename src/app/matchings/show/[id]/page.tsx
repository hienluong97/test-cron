"use client";
import { Stack, Typography } from "@mui/material";
import { useOne, useShow } from "@refinedev/core";
import {
    DateField,
    MarkdownField,
    NumberField,
    Show,
    TextFieldComponent as TextField,
} from "@refinedev/mui";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ChecklistIcon from "@mui/icons-material/Checklist";
import JoinRightIcon from "@mui/icons-material/JoinRight";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WorkIcon from "@mui/icons-material/Work";
import JoinInnerIcon from "@mui/icons-material/JoinInner";


export default function MatchingShow() {
    const { queryResult } = useShow({});
    const { data, isLoading } = queryResult;
    const record = data?.data;

        const { data: userData, isLoading: userIsLoading } =
          useOne({
            resource: "users",
            id: record?.user_id || "",
            queryOptions: {
              enabled: !!record,
            },
          });

        const userInfo = userData?.data;

           const { data: jobData, isLoading: jobIsLoading } = useOne({
             resource: "jobs",
             id: record?.job_id || "",
             queryOptions: {
               enabled: !!record,
             },
           });

           const jobInfo = jobData?.data;

    return (
      <Show isLoading={isLoading}>
        <Stack gap={1}>
          <Grid item xs={12} lg={3} sx={{ paddingBottom: "80px" }}>
            <Card sx={{ padding: { xs: 0, md: 2 } }}>
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
                    key={userInfo?.id}
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
                      <Box component="div">
                        <Box component="div">
                          <h3>{userInfo?.title}</h3>
                        </Box>
                        <Box
                          component="div"
                          sx={{
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                          }}
                        >
                          <PersonSearchIcon />
                          <span>{userInfo?.first_name}</span>
                        </Box>
                        <Box
                          component="div"
                          sx={{
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                          }}
                        >
                          <ChecklistIcon />
                          <span>{userInfo?.introduction}</span>
                        </Box>
                        <Box
                          component="div"
                          sx={{
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                          }}
                        >
                          <JoinRightIcon />
                          <span>{userInfo?.pr_adaptation}</span>
                        </Box>
                      </Box>
                    </Box>
                    <Box component="div" sx={{ minWidth: "120px" }}>
                      <Link href={`/users/show/${userInfo?.id}`}>
                        もっと見る
                      </Link>
                    </Box>
                  </Box>
                  <Box
                    key={jobInfo?.id}
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
                      <Box component="div">
                        <Box component="div">
                          <h3>{jobInfo?.title}</h3>
                        </Box>
                        <Box
                          component="div"
                          sx={{
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                          }}
                        >
                          <WorkIcon />
                          <span>{jobInfo?.description}</span>
                        </Box>
                        <Box
                          component="div"
                          sx={{
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                          }}
                        >
                          <LocationOnIcon />
                          <span>{jobInfo?.work_location}</span>
                        </Box>
                        <Box
                          component="div"
                          sx={{
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                          }}
                        >
                          <AttachMoneyIcon />
                          <span>{jobInfo?.salary_lower}</span>
                        </Box>
                      </Box>
                    </Box>
                    <Box component="div" sx={{ minWidth: "120px" }}>
                      <Link href={`/jobs/show/${jobInfo?.id}`}>もっと見る</Link>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Typography variant="body1" fontWeight="bold">
            {"score"}
          </Typography>
          <TextField value={record?.score} />

          <Typography variant="body1" fontWeight="bold">
            {"作成日時"}
          </Typography>
          <DateField value={record?.createdAt} />
        </Stack>
      </Show>
    );
}
