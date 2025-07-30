
"use client";

export default function InputError({ messages, inputName, simple }: { messages: string[], inputName: string, simple?: boolean }) {
    return messages && (simple ?
        <p className="text-red-500 text-xs mt-1">{messages.map(error => <span key={error}>{error}, </span>)}</p> :
        <div className='bg-red-200 rounded-lg p-4 mt-3 text-sm'>
            <p className='text-red-800 font-semibold mb-2'>{inputName} must:</p>
            <ul>
                {messages.map(error => <li key={error} className="text-red-800"> - {error}</li>)}
            </ul>
        </div>);
}