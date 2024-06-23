"use client";

import { Stack, Typography, Button } from "@mui/material";
import { useOne, useShow } from "@refinedev/core";
import {
    DateField,
    MarkdownField,
    NumberField,
    Show,
    ListButton,
    EditButton,
    DeleteButton,
    RefreshButton,
    TextFieldComponent as TextField,
} from "@refinedev/mui";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import JoinInnerIcon from "@mui/icons-material/JoinInner";
import {
    supabaseClient,
    supabaseAdmin
} from "@utility/supabase-client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { OpenAIEmbeddings } from "@langchain/openai";
import { useGo, useParsed } from "@refinedev/core";
import cosineSimilarity from "@utility/cosine-calculate";


type ParsedParams = {
    id: string;
};

type JobDocument = {
    embedding: string;
    job_id: string;
};

type UserData = {
    user_id: string;
    user_embedding: number[];
};

type MatchingJob = {
    score: number;
    job_embedding: number[];
    job_id: string;
    user_id: string;
};

export default function UserShow() {
    const go = useGo();

    const { id: userId } = useParsed<ParsedParams>();
    const { queryResult } = useShow({});
    const { data, isLoading } = queryResult;
    const [matchingJobs, setMatchingJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const record: any = data?.data;

    const { data: userTypeData, isLoading: userTypeIsLoading } = useOne({
        resource: "user_types",
        id: record?.user_type_id || "",
        queryOptions: {
            enabled: !!record,
        },
    });

    let userSkills: any = '';
    if (record?.pr_skill) {
        userSkills = JSON.parse(record?.pr_skill);
    }


    const handleMatching = async () => {
        setLoading(true);
        try {
            // get embedding of user
            const userData = await getOrCreateUserEmbedding(userId as string);
            if (!userData) throw new Error("User embedding not found");

            // delete old matching
            await deleteOldMatching(userId as string);

            // create new matching
            const matchingJobs = await createNewMatching(userData, 0.9, 10);
            if (!matchingJobs) throw new Error("No matching jobs found");

            // insert new matching
            await insertMatchingData(userId as string, matchingJobs);
        } catch (error) {
            console.error("Error handling matching:", error);
        } finally {
            setLoading(false);
        }
    };


    const getOrCreateUserEmbedding = async (userId: string) => {

        const { data: isUserVectorExist, error: checkUserVectorExistError } =
            await supabaseClient
                .from("user_documents")
                .select("*")
                .eq("user_id", userId);

        if (checkUserVectorExistError) {
            throw new Error(JSON.stringify(checkUserVectorExistError));
        }

        if (isUserVectorExist && isUserVectorExist.length > 0) {
            return {
                user_id: userId,
                user_embedding: JSON.parse(isUserVectorExist[0].embedding),
            };
        } else {
            const openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY!;
            const openAIEmbeddings = new OpenAIEmbeddings({ openAIApiKey });

            const {
                address,
                introduction,
                self_promotion,
                languages,
                app_frameworks,
                databases,
                platforms,
                qualifications,
                business_types,
                other_qualifications,
                faculty,
                major,
                pr_relationship,
                pr_adaptation,
                ...other
            } = record || {};

            const vectorText = [
                address,
                introduction,
                self_promotion,
                languages,
                app_frameworks,
                databases,
                platforms,
                qualifications,
                business_types,
                other_qualifications,
                faculty,
                major,
                pr_relationship,
                pr_adaptation,
            ].join(" ");


            const embedding = await openAIEmbeddings.embedQuery(vectorText);

            const { error: insertUserVectorError } = await supabaseClient
                .from("user_documents")
                .insert({
                    user_id: userId,
                    embedding,
                    content: vectorText,
                });

            if (insertUserVectorError) {
                throw new Error(JSON.stringify(insertUserVectorError));
            }

            return {
                user_id: userId,
                user_embedding: JSON.parse(embedding as any),
            };
        }
    };



    const deleteOldMatching = async (userId: string) => {
        const { error } = await supabaseClient
            .from("matchings")
            .delete()
            .eq("user_id", userId);

        if (error) {
            console.error("Error deleting old matching:", error);
            throw error;
        }
    };

    const createNewMatching = async (
        userData: UserData,
        match_threshold: number,
        match_count: number
    ): Promise<MatchingJob[]> => {
        const { data: jobDocuments, error: getJobDocumentsError } =
            await supabaseClient.from("job_documents").select("embedding, job_id");

        if (getJobDocumentsError) {
            console.error("Error fetching job documents:", getJobDocumentsError);
            return [];
        }

        if (!jobDocuments) {
            console.error("No job documents found.");
            return [];
        }

        const { user_id, user_embedding } = userData;

        const matches = jobDocuments
            .map((jobItem: JobDocument) => {
                const job_embedding = JSON.parse(jobItem.embedding);
                const score = cosineSimilarity(user_embedding, job_embedding);
                return { score, job_embedding, job_id: jobItem.job_id, user_id };
            })
            .filter((item) => item.score > match_threshold);

        matches.sort((a, b) => b.score - a.score);

        const matchingResult = matches.slice(0, match_count);
        return matchingResult;
    };

    const insertMatchingData = async (
        userId: string,
        matchingJobs: MatchingJob[]
    ) => {
        const matchingJobsData = matchingJobs.map((item) => ({
            user_id: item.user_id,
            job_id: item.job_id,
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
                    .eq("user_id", userId);

                if (error) {
                    console.error("Error fetching matching data:", error);
                    return;
                }

                if (data) {
                    const matchingJobsId = data.map((job: any) => job?.job_id);

                    try {
                        const { data: jobData, error } = await supabaseClient
                            .from("jobs")
                            .select("*")
                            .in("id", matchingJobsId);

                        if (error) {
                            console.error("Error fetching matching data:", error);
                            return;
                        }

                        if (jobData) {
                            setMatchingJobs(jobData);
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
        <Show
            isLoading={isLoading}
            headerButtons={({
                deleteButtonProps,
                editButtonProps,
                listButtonProps,
                refreshButtonProps,
            }) => (
                <>
                    {listButtonProps && (
                        <ListButton {...listButtonProps} />
                    )}
                    {editButtonProps && (
                        <EditButton {...editButtonProps} />
                    )}
                    {deleteButtonProps && (
                        <DeleteButton
                            {...deleteButtonProps}
                            onSuccess={async () => {
                                var userId: string = record?.recordItemId;
                                await supabaseAdmin.auth.admin.deleteUser(userId);

                                go({
                                    to: {
                                        resource: "users",
                                        action: "list"
                                    },
                                    type: "push",
                                });
                            }}
                        />
                    )}
                    <RefreshButton {...refreshButtonProps} />
                </>
            )}
        >
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
                        <p> &nbsp; あなたへのオススメ求人をを見よう！</p>
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
                                    {matchingJobs && matchingJobs?.length > 0 ? (
                                        matchingJobs?.map((job: any) => (
                                            <Box
                                                key={job?.id}
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
                                                            <h3>{job?.title}</h3>
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
                                                            <span>{job?.description}</span>
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
                                                            <span>{job?.work_location}</span>
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
                                                            <span>{job?.salary_lower}</span>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                                <Box component="div" sx={{ minWidth: "120px" }}>
                                                    <Link href={`/jobs/show/${job?.id}`}>
                                                        もっと見る
                                                    </Link>
                                                </Box>
                                            </Box>
                                        ))
                                    ) : (
                                        <p>あなたに合った仕事が見つかりませんでした。</p>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ) : null}

                <Typography variant="body1" fontWeight="bold">
                    {"ID"}
                </Typography>
                <TextField value={record?.id ?? ""} />
                <br />
                <Typography variant="body1" fontWeight="bold">
                    {"名"}
                </Typography>
                <TextField value={record?.first_name} />
                <br />

                <Typography variant="body1" fontWeight="bold">
                    {"メールアドレス"}
                </Typography>
                <TextField value={record?.email ?? ""} />

                <br />
                <Typography variant="body1" fontWeight="bold">
                    {"性別"}
                </Typography>
                {record?.birthday ? (
                    <TextField value={record?.gender} />
                ) : (
                    <TextField value="未入力" />
                )}

                <br />
                <Typography variant="body1" fontWeight="bold">
                    {"生年月日"}
                </Typography>
                {record?.birthday ? (
                    <DateField value={record?.birthday} />
                ) : (
                    <TextField value="未入力" />
                )}

                <br />
                <Typography variant="body1" fontWeight="bold">
                    {"郵便番号"}
                </Typography>
                {record?.postal_code ? (
                    <TextField value={record?.postal_code} />
                ) : (
                    <TextField value="未入力" />
                )}

                <br />
                <Typography variant="body1" fontWeight="bold">
                    {"住所"}
                </Typography>
                {record?.address ? (
                    <TextField value={record?.address} />
                ) : (
                    <TextField value="未入力" />
                )}

                <br />
                <Typography variant="body1" fontWeight="bold">
                    {"電話番号"}
                </Typography>
                {record?.phone ? (
                    <DateField value={record?.phone} />
                ) : (
                    <TextField value="未入力" />
                )}

                <br />
                <Typography variant="body1" fontWeight="bold">
                    {"会員タイプ"}
                </Typography>
                {userTypeIsLoading ? (
                    <>Loading...</>
                ) : (
                    <>
                        <TextField value={userTypeData?.data?.name} />
                    </>
                )}

                <br />
                <Typography variant="body1" fontWeight="bold">
                    {"自己紹介"}
                </Typography>
                {record?.introduction ? (
                    <MarkdownField value={record?.introduction} />
                ) : (
                    <TextField value="未入力" />
                )}

                <br />
                <Typography variant="body1" fontWeight="bold">
                    {"スキルPR "}
                </Typography>
                {userSkills?.self_promotion ? (
                    <TextField value={userSkills?.self_promotion} />
                ) : (
                    <TextField value="未入力" />
                )}

                <br />
                <Typography variant="body1" fontWeight="bold">
                    {"人間関係PR"}
                </Typography>
                {record?.pr_relationship ? (
                    <TextField value={record?.pr_relationship} />
                ) : (
                    <TextField value="未入力" />
                )}

                <br />
                <Typography variant="body1" fontWeight="bold">
                    {"適応力PR"}
                </Typography>
                {record?.pr_adaptation ? (
                    <TextField value={record?.pr_adaptation} />
                ) : (
                    <TextField value="未入力" />
                )}

                <br />
                <Typography variant="body1" fontWeight="bold">
                    {"作成日時"}
                </Typography>
                <DateField value={record?.createdAt} />
            </Stack>
        </Show>
    );
}
