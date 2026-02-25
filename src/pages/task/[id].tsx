import Head from "next/head";
import { Textarea } from "@/components/textarea";
import styles from "./styles.module.css"
import { GetServerSideProps } from "next";
import { db } from "@/services/firebaseConnection";
import { doc, collection, query, where, getDoc, addDoc, getDocs, deleteDoc, } from "firebase/firestore";
import { FaTrash } from "react-icons/fa"
import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";

interface CommentsProps{
    id: string
    comment: string
    user: string
    name: string
    taskId: string
}

interface TaskProps {
    item:{
        tarefa: string
        created: string
        public: boolean
        user: string
        taskId: string
    }
    allComments: CommentsProps[]
}
export default function Task({item, allComments}: TaskProps){
    const {data: session} = useSession()
    const [input, setInput] = useState("")
    const [comments, setComments] = useState<CommentsProps[]>(allComments || [])

    async function handleComment(e: FormEvent){
        e.preventDefault()
        if(!input){
           return alert("Digite um comentário")
        }
        if(!session?.user?.email || !session?.user?.name){
            return alert("Usuário não está logado")
        }
        
        try{
            const docRef = await addDoc(collection(db, "comments"), {
                comment: input,
                created: new Date(),
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: item?.taskId
            })
            const data = {
                id: docRef.id,
                comment: input,
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: item.taskId
            }
            setComments((oldItem)=> [...oldItem, data] )
            setInput("")

        }catch(error){
            console.log(error)
        }
    }

    async function handleDeleteComment(id: string){
        try{
            const docRef = doc(db, "comments", id)
            await deleteDoc(docRef)
            const deletComment = comments.filter((item)=> item.id !== id)
            setComments(deletComment)
        }catch(error){
            console.log(error)
        }
        

    }
    return(
        <div className={styles.container}>
            <Head>
                <title>Detalhes da tarefa</title>
            </Head>

            <main className={styles.main}>
                <h1>Tarefa</h1>
                <article className={styles.task}>
                    <p>{item.tarefa}</p>
                </article>
            </main>
           
           <section className={styles.commentsContainer}>
                <h2>Deixar comentário</h2>

                <form onSubmit={handleComment}>
                    <Textarea 
                    placeholder="Deixe seu comentário"
                    value={input}
                    onChange={(e)=> setInput(e.target.value)}
                    />
                    <button type="submit" disabled={!session?.user} className={styles.button}>Enviar comentário</button>
                </form>

           </section>

           <section className={styles.commentsContainer}>
                <h2>Todos os comentários</h2>
                {comments.length === 0 && (
                    <span>Nenhum comentário foi encontrado...</span>
                )}
                {comments.map((item)=>(
                    <article key={item.id} className={styles.comment}>
                        <div className={styles.headComment}>
                            <label className={styles.commentsLabel}>{item.name}</label>
                            {item.user === session?.user?.email && (
                                <button className={styles.buttonTrash} onClick={()=> handleDeleteComment(item.id)}>
                                    <FaTrash size={18} color="#ea3140"/>
                                </button>
                            )} 
                        </div>
                        <p>{item.comment}</p>
                    </article>
                ))}
           </section>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({params})=>{
    const id = params?.id as string
    const docRef = doc(db, "tarefas", id)
    
    const q = query(collection(db, "comments"), where("taskId", "==", id))
    
    const snapshotComments = await getDocs(q)
    let allComments: CommentsProps[] = []

    snapshotComments.forEach((doc)=>{
        allComments.push({
            id: doc.id,
            comment: doc.data().comment,
            name: doc.data().name,
            taskId: doc.data().taskId,
            user: doc.data().user
        })
    })
    
    const snapshot = await getDoc(docRef)

    if(snapshot.data() === undefined){
        return{
            redirect:{
                destination: "/",
                permanent: false,
            },
        }
    }

    if(!snapshot.data()?.public){
         return{
            redirect:{
                destination: "/",
                permanent: false,
            },
        }
    }
    const miliseconds = snapshot.data()?.created?.seconds * 1000

    

    const task = {
        tarefa: snapshot.data()?.tarefa,
        public: snapshot.data()?.public,
        created: new Date(miliseconds).toLocaleDateString(),
        user: snapshot.data()?.user,
        taskId: id
    }
    
    return{
        props: {
            item: task,
            allComments: allComments,
        }
    }

}



