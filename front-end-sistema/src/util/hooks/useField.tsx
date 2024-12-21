import { ChangeEvent, useState } from 'react'

const useField = (type: string = 'text') => {
    const [value, setValue] = useState<string>('')

    const onChange = (e: ChangeEvent) => {
        setValue((e.target as HTMLInputElement).value)
    }

    return {
        type,
        value,
        onChange
    }
}

export { useField }