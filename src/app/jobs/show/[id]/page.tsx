"use client";

import { Stack, Typography, Button } from "@mui/material";
import { useOne, useShow } from "@refinedev/core";
import {
    DateField,
    MarkdownField,
    NumberField,
    Show,
    TextFieldComponent as TextField,
} from "@refinedev/mui";
import RenderImage from "@components/render-image";
import { supabaseClient } from "@utility/supabase-client";
import { useParsed } from "@refinedev/core";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import JoinInnerIcon from "@mui/icons-material/JoinInner";
import Link from "next/link";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ChecklistIcon from "@mui/icons-material/Checklist";
import JoinRightIcon from "@mui/icons-material/JoinRight";
import { OpenAIEmbeddings } from "@langchain/openai";
import cosineSimilarity from "@utility/cosine-calculate";

type ParsedParams = {
    id: string;
};

type JobData = {
    job_id: string;
    job_embedding: number[];
};

type UserDocument = {
    embedding: string;
    user_id: string;
};

type MatchingJob = {
    score: number;
    user_embedding: number[];
    job_id: string;
    user_id: string;
};


export default function JobShow() {
    const { id: jobId } = useParsed<ParsedParams>();
    const { queryResult } = useShow({});

    const { data, isLoading } = queryResult;
    const [matchingUsers, setMatchingUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const record: any = data?.data;

    const { data: statusData, isLoading: statusIsLoading } = useOne({
        resource: "job_statuses",
        id: record?.job_status_id || "",
        queryOptions: {
            enabled: !!record,
        },
    });

    const { data: companyNameData, isLoading: companyNameIsLoading } = useOne({
        resource: "companies",
        id: record?.company_id || "",
        queryOptions: {
            enabled: !!record,
        },
    });

    const handleMatching = async () => {
        setLoading(true);
        try {
            // get embedding of job
            const jobData = await getOrCreateJobEmbedding(jobId as string);
            if (!jobData) throw new Error("Job embedding not found");

            // delete old matching
            await deleteOldMatching(jobId as string);

            // create new matching
            const matchingJobs = await createNewMatching(jobData as any, 0.9, 10);
            if (!matchingJobs) throw new Error("No matching jobs found");

            // insert new matching
            await insertMatchingData(jobId as string, matchingJobs);

        } catch (error) {
            console.error("Error handling matching:", error);
        } finally {
            setLoading(false);
        }
    };

    const getOrCreateJobEmbedding = async (jobId: string) => {
        const { data: isJobVectorExist, error: checkJobVectorExistError } =
            await supabaseClient
                .from("job_documents")
                .select("*")
                .eq("job_id", jobId);

        if (checkJobVectorExistError) {
            throw new Error(JSON.stringify(checkJobVectorExistError));
        }

        if (isJobVectorExist && isJobVectorExist.length > 0) {
            return {
                job_id: jobId,
                job_embedding: JSON.parse(isJobVectorExist[0].embedding),
            };
        } else {
            const openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY!;
            const openAIEmbeddings = new OpenAIEmbeddings({ openAIApiKey });

            const {
                work_location,
                title,
                description,
                desired_candidates,
                job_category,
                appeal_points,
                outline,
                ocr_text,
            } = record || {};

            const vectorText = [
                work_location,
                title,
                description,
                desired_candidates,
                job_category,
                appeal_points,
                outline,
                ocr_text,
            ].join(" ");

            const embedding = await openAIEmbeddings.embedQuery(vectorText);

            const { error: insertJobVectorError } = await supabaseClient
                .from("job_documents")
                .insert({
                    job_id: jobId,
                    embedding,
                    content: vectorText,
                });

            if (insertJobVectorError) {
                throw new Error(JSON.stringify(insertJobVectorError));
            }

            return {
                job_id: jobId,
                job_embedding: JSON.parse(embedding as any),
            };
        }
    };

    const deleteOldMatching = async (jobId: string) => {
        const { error } = await supabaseClient
            .from("matchings")
            .delete()
            .eq("job_id", jobId);

        if (error) {
            console.error("Error deleting old matching:", error);
            throw error;
        }
    };

    const createNewMatching = async (
        jobData: JobData,
        match_threshold: number,
        match_count: number
    ): Promise<MatchingJob[]> => {
        const { data: userDocuments, error: getUserDocumentsError } =
            await supabaseClient.from("user_documents").select("embedding, user_id");

        if (getUserDocumentsError) {
            console.error("Error fetching user documents:", getUserDocumentsError);
            return [];
        }

        if (!userDocuments) {
            console.error("No user documents found.");
            return [];
        }

        const { job_id, job_embedding } = jobData;

        const matches = userDocuments
            .map((userItem: UserDocument) => {
                const user_embedding = JSON.parse(userItem.embedding);
                const score = cosineSimilarity(user_embedding, job_embedding);
                return { score, user_embedding, job_id, user_id: userItem.user_id };
            })
            .filter((item) => item.score > match_threshold);

        matches.sort((a, b) => b.score - a.score);

        const matchingResult = matches.slice(0, match_count);
        return matchingResult;
    };

    const insertMatchingData = async (
        jobId: string,
        matchingJobs: MatchingJob[]
    ) => {
        const matchingJobsData = matchingJobs.map((item) => ({
            user_id: item.user_id,
            job_id: jobId,
            score: item.score,
        }));

        const { error } = await supabaseClient
            .from("matchings")
            .insert(matchingJobsData);

        if (error) {
            console.error("Error inserting matching data:", error);
            throw error;
        }
    };

    
    useEffect(() => {
        const fetchMatchingData = async () => {
            try {
                const { data, error } = await supabaseClient
                    .from("matchings")
                    .select("*")
                    .eq("job_id", jobId);

                if (error) {
                    console.error("Error fetching matching data:", error);
                    return;
                }

                if (data) {
                    const matchingUsersId = data.map(
                        (user: any) => user?.user_id
                    );

                    try {
                        const { data: userData, error } = await supabaseClient
                            .from("users")
                            .select("*")
                            .in("id", matchingUsersId);

                        if (error) {
                            console.error("Error fetching matching data:", error);
                            return;
                        }

                        if (userData) {
                            setMatchingUsers(userData);
                        }
                    } catch (error) {
                        console.error("Unexpected error:", error);
                    }
                }
            } catch (error) {
                console.error("Unexpected error:", error);
            }
        };

        fetchMatchingData();
    }, [loading]);



    return (
        <Show isLoading={isLoading}>
            <Stack gap={1}>
                <Box
                    component="div"
                    sx={{
                        paddingTop: "60px",
                        paddingBottom: "30px",
                    }}
                >
                    <Button variant="outlined" onClick={handleMatching}>
                        <JoinInnerIcon />
                        <p> &nbsp; 貴社へのオススメ求職者をを見よう！</p>
                    </Button>
                </Box>

                {!loading ? (
                    <Grid item xs={12} lg={3} sx={{ paddingBottom: "160px" }}>
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
                                    {matchingUsers && matchingUsers?.length > 0 ? (
                                        matchingUsers?.map((user: any) => (
                                            <Box
                                                key={user?.id}
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
                                                            <h3>{user?.title}</h3>
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
                                                            <span>{user?.first_name}</span>
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
                                                            <span>{user?.introduction}</span>
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
                                                            <span>{user?.pr_adaptation}</span>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                                <Box component="div" sx={{ minWidth: "120px" }}>
                                                    <Link href={`/users/show/${user?.id}`}>
                                                        もっと見る
                                                    </Link>
                                                </Box>
                                            </Box>
                                        ))
                                    ) : (
                                        <p> 貴社へのオススメ求職者が見つかりませんでした。</p>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ) : null}

                <Typography variant="body1" fontWeight="bold">
                    {"ID"}
                </Typography>
                <NumberField value={record?.id ?? ""} />
                <Typography variant="body1" fontWeight="bold" marginTop="18px">
                    {"職名"}
                </Typography>
                <TextField value={record?.title} />
                <Typography variant="body1" fontWeight="bold" marginTop="18px">
                    {"最高給料"}
                </Typography>
                <NumberField value={record?.salary_upper ?? ""} />

                <Typography variant="body1" fontWeight="bold" marginTop="18px">
                    {"通勤地"}
                </Typography>
                <TextField value={record?.work_location} />

                <Typography variant="body1" fontWeight="bold" marginTop="18px">
                    {"企業名"}
                </Typography>
                {companyNameIsLoading ? (
                    <>Loading...</>
                ) : (
                    <> {companyNameData?.data?.name}</>
                )}

                <Typography variant="body1" fontWeight="bold" marginTop="18px">
                    {"義務内容"}
                </Typography>
                <MarkdownField value={record?.description} />

                <Typography variant="body1" fontWeight="bold" marginTop="18px">
                    {"アピールポイント"}
                </Typography>
                <TextField value={record?.appeal_points} />

                <Typography variant="body1" fontWeight="bold" marginTop="18px">
                    {"求める人材像"}
                </Typography>
                <TextField value={record?.desired_candidates} />

                <Typography variant="body1" fontWeight="bold" marginTop="18px">
                    {"概要"}
                </Typography>
                <TextField value={record?.outline} />

                <Typography variant="body1" fontWeight="bold" marginTop="18px">
                    {"ステタス"}
                </Typography>
                {statusIsLoading ? <>Loading...</> : <> {statusData?.data?.name}</>}

                <Typography variant="body1" fontWeight="bold" marginTop="18px">
                    {"サムネイル"}
                </Typography>
                <RenderImage
                    url={record?.thumbnail}
                    size={{ width: 200, height: 200 }}
                />

                <Typography variant="body1" fontWeight="bold" marginTop="18px">
                    {"作成日"}
                </Typography>
                <DateField value={record?.createdAt} />
            </Stack>
        </Show>
    );
}
