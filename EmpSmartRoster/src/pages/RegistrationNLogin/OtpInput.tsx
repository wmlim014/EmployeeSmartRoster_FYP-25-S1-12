import { useMemo } from 'react';
import './OtpInput.css'

// References: 
// https://dominicarrojado.com/posts/how-to-create-your-own-otp-input-in-react-and-typescript-with-tests-part-1/

export type OtpInputProps = {
    value: string;
    valueLength: number;
    onChange: (value: string) => void;
}

const RE_DIGIT = new RegExp(/^\d+$/);

export default function OtpInput({value, valueLength, onChange}: OtpInputProps) {
    // Allow input to display dynamic data
    const valueItems = useMemo(() => {
        const valueArr = value.split('');
        const items: Array<string> = [];

        for (let i = 0; i < valueLength; i++) {
            const char = valueArr[i];

            if (RE_DIGIT.test(char)) {
                items.push(char);
            } else {
                items.push('');
            }
        }
        return items;
    }, [value, valueLength])

    // Allow typing digits in input boxes from parent
    const inputOnChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        idx: number
    ) => {
        const target = e.target
        const targetValue = target.value;

        // Check if the 
        if(!RE_DIGIT.test(targetValue)){
            return;
        }

        const newValue = 
            value.substring(0, idx) 
            + targetValue 
            + value.substring(idx + 1);

        onChange(newValue);

        const nextElementSibling = 
            target.nextElementSibling as HTMLInputElement | null;

        if (nextElementSibling) {
            nextElementSibling.focus();
        }
    }

    return(
        <div className="otp-input-group">
            {valueItems.map((digit, idx) => (
                <input
                    key={idx}
                    type='text'
                    inputMode='numeric'
                    autoComplete='one-time-code'
                    pattern='\d{1}'
                    maxLength={valueLength}
                    className='otp-input'
                    value={digit}
                    onChange={(e) => inputOnChange(e, idx)}
                    required />
            ))}
        </div>
    )
}