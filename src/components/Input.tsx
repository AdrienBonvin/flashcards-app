export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({...props}) => 
    <input  {...props} className={`w-3/5 p-4 rounded-xl ${props.className ?? ""}`} type="text"></input>
