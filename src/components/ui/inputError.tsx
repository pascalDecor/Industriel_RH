
"use client";

export default function InputError({ messages, inputName }: { messages: string[], inputName: string }) {
    return messages && <div className='bg-red-200 rounded-lg p-4 mt-3 text-sm'>
        <p className='text-red-800 font-semibold mb-2'>{inputName} must:</p>
        <ul>
            {messages.map(error => <li key={error} className="text-red-800"> - {error}</li>)}
        </ul>
    </div>;
}