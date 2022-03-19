import { useRef, useState, useEffect } from "react"
import Editor from "@monaco-editor/react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import axios from "axios";

const Form = () => {
    const name = useRef()
    const content = useRef()
    const [description, setDescription] = useState(`# Content of My Story \n # To Add More Than 1 Slide, use \n ## *** in a new line\n ## Example -> \n ***`)
    const coverPhoto = useRef()
    const [loading, setLoading] = useState(false)

    const submit = (e) => {
        e.preventDefault()
        setLoading(true)
        const slides = description.split('***')
        const bgLink = coverPhoto.current.value.split(',')
        const story = {
            name: name.current.value,
            description: description,
            slides: slides.map((slide, index) => {
                return {
                    number: index + 1,
                    content: slide,
                    bgType: 'img',
                    text_style: 'd-flex flex-column min-vh-100 justify-content-center align-items-center',
                    bgLink: bgLink[index] ? bgLink[index] : bgLink[0]
                }
            }),
        }
        axios.post('/api/story', {
            story
        }).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        })    
    }

    return (
        <div className="w-screen flex justify-center">
            <div className="p-4 w-full bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 lg:p-8 max-h-md" data-aos="zoom-in">
                <form className="space-y-6" onSubmit={submit}>
                    <h3 className="text-xl font-medium text-gray-900 text-center">Submit Your Story</h3>
                    <div className="w-full mx-2">
                        <label htmlFor="name" className="mb-2 font-medium text-gray-900 cursor-pointer flex flex-1 justify-between text-xl">Name</label>
                        <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="My Story" required ref={name} />
                    </div>
                    <div className="w-full mx-2">
                        <label htmlFor="desc" className="mb-2 font-medium text-gray-900 text-xl flex flex-1 justify-between">Description</label>
                        <textarea type="text" name="desc" id="desc" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Description of your story" required ref={content} />
                    </div>
                    
                    
                    <div className="flex w-full xl:flex-row flex-col">
                        <div className="w-full">
                            <div className="flex w-full flex-col items-center">
                                <h1 className="mb-2 font-medium text-gray-900 cursor-default flex flex-1 justify-between text-xl" >Content</h1>
                                <div className="flex">
                                    <div className="w-full max-h-[500]">
                                        <Editor
                                            width='100%'
                                            height='500px'
                                            className="max-h-xl w-full sm:min-w-[640px] min-w-[250px] my-2"
                                            defaultLanguage="markdown"
                                            theme="vs-dark"
                                            defaultValue={description}
                                            onChange={(v, e) => setDescription(v)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full mx-2">


                            <div className="w-full mx-2">
                                <label htmlFor="cover_photo" className="cursor-pointer mb-2 text-xl font-medium text-gray-900 flex felx-1 justify-between">Cover Photo</label>
                                <input type='url' name="cover_photo" id="cover_photo" placeholder="https://1.com/yourPhoto.jpg,https://2.com/yourPhoto.jpg..." className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required ref={coverPhoto} />
                            </div>
                            <div className="w-full mt-4 overflow-auto">
                                <h1 className="mb-2 font-medium text-gray-900 cursor-default flex flex-1 justify-between text-xl">Preview</h1>
                                <div className="bg-[#1e1e1e] w-full h-full overflow-auto">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} className="w-full text-white md-preview h-[382px] my-2">{description}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full text-white bg-blue-700 transition-all duration-1000 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-blue-600" disabled={loading}>Submit</button>
                </form>
            </div >
        </div >
    )
}

export default Form