export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({...props}) => 
    <textarea  {...props} className={`w-3/5 p-4 rounded-xl ${props.className ?? ""}`}/>
