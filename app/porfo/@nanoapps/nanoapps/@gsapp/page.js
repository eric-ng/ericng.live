'use client';

import {useState} from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import App from '@/app/porfo/@nanoapps/nanoapps/@gsapp/app';

export default function GsApp() {
    const [term, setTerm] = useState('');
    const typeHandler = (e) => {
        setTerm(e.target.value);
    };
    
    return (
        <div className="m-12">
            <div className="my-2">
                <TextField 
                    value={term}
                    placeholder={'Search'}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <ManageSearchOutlinedIcon />
                                </InputAdornment>
                            ),
                        },
                    }}
                    onChange={typeHandler}
                />
            </div>
            <App term={term} />
        </div>
    );
}