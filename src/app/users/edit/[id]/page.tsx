"use client";
import { HttpError } from "@refinedev/core";
import { Autocomplete, Box, Button, Select, TextField } from "@mui/material";
import { Edit, useAutocomplete, DeleteButton, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/ja';
import {
    supabaseClient,
    supabaseAdmin
} from "@utility/supabase-client";
import { yupResolver } from "@hookform/resolvers/yup";
import { editUserSchema } from "@validation/index";
import { OpenAIEmbeddings } from '@langchain/openai';
import { useParsed } from "@refinedev/core";
import { Gender } from "@interfaces/index";
import { useGo } from "@refinedev/core";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { useState } from 'react'
import Skill from "@components/skill"

type ParsedParams = {
    id: string;
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function UserEdit() {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    dayjs.locale('ja');

    const go = useGo();

    const {
        id: userId,
    } = useParsed<ParsedParams>();


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
                select: "*, user_types(id, name) ",
            },
        },
        resolver: yupResolver(editUserSchema),
        defaultValues: async () => {
            const { data, error } = await supabaseClient
                .from("users")
                .select("pr_skill, education")
                .eq("id", userId);

            const skills = JSON.parse(data?.[0]?.pr_skill);
            const educations = JSON.parse(data?.[0]?.education);
            return {
                ...skills,
                ...educations,
            };
        },
    });


    const handleSubmitForm = async (data: any) => {
        const {
            first_name,
            last_name,
            first_kana,
            last_kana,
            gender,
            birthday,
            postal_code,
            address,
            phone,
            introduction,
            self_promotion,
            qualifications,
            languages,
            business_types,
            app_frameworks,
            databases,
            platforms,
            other_qualifications,
            name,
            faculty,
            major,
            graduation_year,
            pr_relationship,
            pr_adaptation,
            email_opt_in,
            is_demo_user,
        } = data;

        const skills = {
            self_promotion,
            qualifications,
            languages,
            business_types,
            app_frameworks,
            databases,
            platforms,
            other_qualifications
        }

        const educations = {
            name,
            faculty,
            major,
            graduation_year,
        }

        onFinish({
            first_name,
            last_name,
            first_kana,
            last_kana,
            gender,
            birthday,
            postal_code,
            address,
            phone,
            introduction,
            pr_skill: skills,
            education: educations,
            pr_relationship,
            pr_adaptation
        });

        const { error: updateSkillsError } = await supabaseClient
            .from("skills")
            .update({
                ...skills
            })
            .eq("user_id", userId);

        const { error: updateEducationsError } = await supabaseClient
            .from("educations")
            .update({
                ...educations
            })
            .eq("user_id", userId);

        // create vector
        const openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY!;

        const openAIEmbeddings = new OpenAIEmbeddings({
            openAIApiKey: openAIApiKey,
        });

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

        const { data: checkVectorData, error: checkVectorError } =
            await supabaseClient
                .from("user_documents")
                .select("*")
                .eq("user_id", userId);
        var updateUserVector;

        if (checkVectorData && checkVectorData.length > 0) {
            const { error: updateUserVector } = await supabaseClient
                .from("user_documents")
                .update([
                    {
                        user_id: userId,
                        embedding: embedding,
                        content: vectorText
                    },
                ])
                .eq("user_id", userId);
        } else {
            const { error: updateUserVector } = await supabaseClient
                .from("user_documents")
                .insert([
                    {
                        user_id: userId,
                        embedding: embedding,
                        content: vectorText
                    },
                ]);
        }

        if (!updateSkillsError && !updateEducationsError && !updateUserVector) {
            return {
                success: true,
                successNotification: {
                    message: "アカウント作成に成功しました。",
                },
            };
        } else {
            return {
                success: false,
                error:
                    JSON.parse(JSON.stringify(updateEducationsError)),
            };
        }
    };


    return (
        <Edit
            isLoading={formLoading}
            // saveButtonProps={handleSubmitForm}
            saveButtonProps={{ onClick: handleSubmit(handleSubmitForm) }}
            footerButtons={({ saveButtonProps, deleteButtonProps }) => (
                <>
                    {deleteButtonProps && (
                        <DeleteButton
                            {...deleteButtonProps}
                            onSuccess={async () => {
                                var userId: any = deleteButtonProps?.recordItemId;
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
                    <SaveButton {...saveButtonProps} />
                </>
            )}
        >
            <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column" }}
                autoComplete="off"
            >
                {/* <TextField
                    {...register("first_name")}
                    error={!!(errors as any)?.first_name}
                    helperText={(errors as any)?.first_name?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={"名"}
                    name="first_name"
                />
                <TextField
                    {...register("last_name")}
                    error={!!(errors as any)?.last_name}
                    helperText={(errors as any)?.last_name?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={"姓"}
                    name="last_name"
                />
                <TextField
                    {...register("first_kana")}
                    error={!!(errors as any)?.first_kana}
                    helperText={(errors as any)?.first_kana?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={"名（カナ）"}
                    name="first_kana"
                />
                <TextField
                    {...register("last_kana")}
                    error={!!(errors as any)?.last_kana}
                    helperText={(errors as any)?.last_kana?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={"姓（カナ）"}
                    name="last_kana"
                />
                <Controller
                    control={control}
                    name="gender"
                    // eslint-disable-next-line
                    defaultValue={null as any}
                    render={({ field }) => (
                        <Autocomplete<Gender>
                            id="gender"
                            {...field}
                            options={["女性", "男性", "他"]}
                            onChange={(_, value) => {
                                field.onChange(value);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="性別"
                                    margin="normal"
                                    variant="outlined"
                                    error={!!(errors as any)?.gender}
                                    helperText={(errors as any)?.gender?.message}
                                />
                            )}
                        />
                    )}
                />
                <Controller
                    name="birthday"
                    control={control}
                    render={({ field: { value, onChange, ...restField } }) => (
                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale="ja"
                        >
                            <DatePicker
                                sx={{ margin: "16px 0 18px", width: "100%" }}
                                label="生年月日"
                                onChange={(value: any) => {
                                    onChange(dayjs(value).format("YYYY-MM-DD"));
                                }}
                                format="YYYY-MM-DD"
                                // {...restField}
                                defaultValue={
                                    queryResult?.data?.data?.birthday
                                        ? dayjs(queryResult?.data?.data?.birthday)
                                        : dayjs(new Date())
                                }
                            />
                        </LocalizationProvider>
                    )}
                />
                <TextField
                    {...register("postal_code")}
                    error={!!(errors as any)?.postal_code}
                    helperText={(errors as any)?.postal_code?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={"郵便番号"}
                    name="postal_code"
                />
                <TextField
                    {...register("address")}
                    error={!!(errors as any)?.address}
                    helperText={(errors as any)?.address?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={"住所"}
                    name="address"
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
                    {...register("introduction")}
                    error={!!(errors as any)?.introduction}
                    helperText={(errors as any)?.introduction?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={"自己紹介"}
                    name="introduction"
                /> */}

                <br />
                <p>スキル編集</p>

                <Button variant="outlined" sx={{ maxWidth: "200px", }} onClick={handleClickOpen}>
                    <AddCircleOutlineIcon />
                    Add skills
                </Button>
                <Skill userId ={userId} open={open} handleClose ={handleClose}/>

                {/* <TextField
                    {...register("self_promotion")}
                    error={!!(errors as any)?.self_promotion}
                    helperText={(errors as any)?.self_promotion?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={"self_promotion"}
                    name="self_promotion"
                />
                <TextField
                    {...register("qualifications")}
                    error={!!(errors as any)?.qualifications}
                    helperText={(errors as any)?.qualifications?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={"qualifications"}
                    name="qualifications"
                />
                <TextField
                    {...register("business_types")}
                    error={!!(errors as any)?.business_types}
                    helperText={(errors as any)?.business_types?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={"business_types"}
                    name="business_types"
                />
                <TextField
                    {...register("languages")}
                    error={!!(errors as any)?.languages}
                    helperText={(errors as any)?.languages?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={"languages"}
                    name="languages"
                />
                <TextField
                    {...register("app_frameworks")}
                    error={!!(errors as any)?.app_frameworks}
                    helperText={(errors as any)?.app_frameworks?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={"app_frameworks"}
                    name="app_frameworks"
                />
                <TextField
                    {...register("databases")}
                    error={!!(errors as any)?.databases}
                    helperText={(errors as any)?.databases?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={"databases"}
                    name="databases"
                />

                <TextField
                    {...register("platforms")}
                    error={!!(errors as any)?.platforms}
                    helperText={(errors as any)?.platforms?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={"platforms"}
                    name="platforms"
                />

                <TextField
                    {...register("other_qualifications")}
                    error={!!(errors as any)?.other_qualifications}
                    helperText={(errors as any)?.other_qualifications?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={"other_qualifications"}
                    name="other_qualifications"
                /> */}

                {/* <br />
                <p>学歴編集</p>
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
                />
                <TextField
                    {...register("faculty")}
                    error={!!(errors as any)?.faculty}
                    helperText={(errors as any)?.faculty?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={"faculty"}
                    name="faculty"
                />
                <TextField
                    {...register("major")}
                    error={!!(errors as any)?.major}
                    helperText={(errors as any)?.major?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={"major"}
                    name="major"
                />
                <TextField
                    {...register("graduation_year", {
                        valueAsNumber: true,
                    })}
                    error={!!(errors as any)?.graduation_year}
                    helperText={(errors as any)?.graduation_year?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="number"
                    label={"graduation_year"}
                    name="graduation_year"
                />
                <br />
                <p>その他</p>
                <TextField
                    {...register("pr_relationship")}
                    error={!!(errors as any)?.pr_relationship}
                    helperText={(errors as any)?.pr_relationship?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={"人間関係PR"}
                    name="pr_relationship"
                />
                <TextField
                    {...register("pr_adaptation")}
                    error={!!(errors as any)?.pr_adaptation}
                    helperText={(errors as any)?.pr_adaptation?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={"適応力PR"}
                    name="pr_adaptation"
                /> */}
            </Box>
        </Edit>
    );
}
