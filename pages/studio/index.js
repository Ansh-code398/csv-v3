import { Button, Typography } from '@mui/material'
import React from 'react'
import { ReactMediaRecorder } from 'react-media-recorder'

const Index = () => {
    return (
        <div>

            <ReactMediaRecorder
                screen
                blobPropertyBag={
                    {
                        type: "video/mp4"
                    }
                }
                render={({ status, startRecording, resumeRecording, pauseRecording, stopRecording, mediaBlobUrl, muteAudio, unMuteAudio, isAudioMuted, clearBlobUrl, previewStream }) => (
                    <>
                        <div className='flex flex-col justify-center'>
                            <div className='flex justify-between flex-wrap'>
                                <div className='min-w-[200px] w-1/2 h-full min-h-[50vh] bg-[#eee] flex items-center'>
                                    {previewStream !== "" && <VideoPreview stream={previewStream} />}
                                </div>
                                <div className='min-w-[200px] w-1/2 h-full min-h-[50vh] max-h-[50vh] bg-[#eef] flex items-center'>
                                    {mediaBlobUrl && <video className='mx-auto max-w-full max-h-[50vh] h-auto w-auto' src={mediaBlobUrl} controls autoPlay loop/>}
                                </div>
                            </div>
                        </div>
                        <div className='text-center my-2'>
                            <Typography variant="h6" className="text-center">
                                Recording Status - {status.toUpperCase().split("_").join(" ")}
                            </Typography>
                            {status === "idle" && <Button color='success' variant='outlined' className='mx-2' onClick={startRecording}>Start Recording</Button>}
                            {status === "recorded" && <Button color='success' variant='outlined' className='mx-2' onClick={startRecording}>Start Recording</Button>}
                            {status === "recording" ? <Button color='success' variant='outlined' className='mx-2 my-2' onClick={pauseRecording}>Pause Recording</Button> : status === "paused" && <Button color='success' variant='outlined' className='mx-2' onClick={resumeRecording}>Resume Recording</Button>}
                            {status !== "idle" && <Button color='success' variant='outlined' className='mx-2 my-3' onClick={stopRecording}>Stop Recording</Button>}
                            {status !== "idle" && !isAudioMuted ? <Button color='success' variant='outlined' className='mx-2' onClick={muteAudio}>Mute Audio</Button> :
                                <Button color='success' variant='outlined' className='mx-2' onClick={unMuteAudio}>Unmute Audio</Button>}
                            {mediaBlobUrl && <Button color='success' variant='outlined' className='mx-2 my-2' onClick={clearBlobUrl}>Clear Recording</Button>}
                        </div>
                    </>
                )}
            />
        </div>
    )
}

const VideoPreview = ({ stream }) => {
    const videoRef = React.useRef(null);
    console.log(stream)
    React.useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    if (!stream) {
        return null;
    }
    return <video className='mx-auto max-w-full max-h-[50vh] h-auto w-auto' ref={videoRef} autoPlay controls={false} />;
};

export default Index