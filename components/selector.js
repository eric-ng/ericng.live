'use client';

import {useState} from 'react';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

export default function Selector({title = 'Random', options = [], changeHandler = () => {}}) {
    const [selectedApp, setSelectedApp] = useState(options?.[0]?.val);
    const handleChange = (e) => {
        setSelectedApp(e.target.value);
        changeHandler();
    }

    return (
        <FormControl>
            <InputLabel id="app-selector-label">{title}</InputLabel>
            <Select
                labelId="app-selector-label"
                id="app-selector"
                value={selectedApp}
                label="NanoApps"
                onChange={handleChange}
            >
                {options.map((option) => (
                    <MenuItem key={option.val} value={option.val}>{option.name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
