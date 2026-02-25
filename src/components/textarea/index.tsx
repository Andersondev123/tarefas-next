import styles from "@/components/textarea/styles.module.css"
import { HTMLProps } from "react"

type TextareaProps = React.ComponentProps<"textarea">

export function Textarea({...rest}: TextareaProps){

    return(
        <textarea className={styles.textarea} {...rest}></textarea>
    )
}