import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { useState } from 'react'
import { styled } from '@mui/material/styles';
import { useForm } from "react-hook-form";
import { Autocomplete, Box, Button, Select, TextField } from "@mui/material";
import { Create } from "@refinedev/mui";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


type SkillProps = {
    open: any;
    handleClose: any;
    userId: any;
};

export default function Skill({ userId, open, handleClose }: SkillProps) {

    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(createSkillSchema),
    });

    function onSubmit(data: any) {
        console.log('data', data)
    }
    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth="md"
            fullWidth={true}
        // sx={{ minWidth: "1200px", }}
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Modal title
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers>
                <Box component="div">
                    <TextField
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
                    />

                </Box>

            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" onClick={handleSubmit(onSubmit)}>
                    Save
                </Button>
            </DialogActions>
        </BootstrapDialog>
    )
}


export const createSkillSchema = yup
    .object({
        self_promotion: yup.string().required(),
        qualifications: yup.string().notRequired(),
        languages: yup.string().notRequired(),
        business_types: yup.string().notRequired(),
        app_frameworks: yup.string().notRequired(),
        databases: yup.string().notRequired(),
        platforms: yup.string().notRequired(),
        other_qualifications: yup.string().notRequired(),
    })
    .required();