"use client";
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { useList, HttpError } from "@refinedev/core";
import { useNotification } from "@refinedev/core";
import Company from '@components/company';

const filter = createFilterOptions<CompanyType>();

export default function FreeSoloCreateOptionDialog() {
    const { open: openNoti } = useNotification();
    const { data: companiesData, isLoading, isError } = useList<CompanyType, HttpError>({
        resource: "companies",
    });
    const products = companiesData?.data ?? [];

    const [value, setValue] = React.useState<CompanyType | null>(null);
    const [open, toggleOpen] = React.useState(false);

    const handleClose = () => {
        setDialogValue({
            name: '',
        });
        toggleOpen(false);
    };

    const [dialogValue, setDialogValue] = React.useState({
        name: '',
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Selected value:', value);
    };


    return (
        <React.Fragment>
            <form onSubmit={handleSubmit}>
                <Autocomplete
                    value={value}
                    onChange={(event, newValue) => {
                        if (typeof newValue === 'string') {
                            // timeout to avoid instant validation of the dialog's form.
                            setTimeout(() => {
                                toggleOpen(true);
                                setDialogValue({
                                    name: newValue,
                                });
                            });
                        } else if (newValue && newValue.inputValue) {
                            toggleOpen(true);
                            setDialogValue({
                                name: newValue.inputValue,
                            });
                        } else {
                            setValue(newValue);
                        }
                    }}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        if (params.inputValue !== '') {
                            filtered.push({
                                inputValue: params.inputValue,
                                id: '',  // id is not relevant for this entry
                                name: `Add "${params.inputValue}"`,
                                description:''
                            });
                        }

                        return filtered;
                    }}
                    id="free-solo-dialog-demo"
                    options={products}
                    getOptionLabel={(option) => {
                        // When the value is an item from the list, we simply return the title
                        if (typeof option === 'string') {
                            return option;
                        }
                        if (option.inputValue) {
                            return option.inputValue;
                        }
                        return option.name;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            {option.name}
                        </li>
                    )}
                    sx={{ width: 300 }}
                    freeSolo
                    renderInput={(params) => <TextField {...params} label="Select a film" />}
                />
                {value && (
                    <div>
                        <TextField
                            margin="dense"
                            label="Name"
                            value={value?.name || null}
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                        />
                        <TextField
                        margin="dense"
                        label="Description"
                        value={value?.description || ''}
                        InputProps={{
                            readOnly: true,
                        }}
                        fullWidth
                        />
                    </div>
                    
                )}
                <Button type="submit">Submit</Button>
            </form>
            
            <Company  openForm={open} handleClose={handleClose} dialogValue={dialogValue}setValue={setValue}  />
        </React.Fragment>
    );
}


interface CompanyType {
    inputValue?: string;
    id: string;
    name: string;
    description: string
}

