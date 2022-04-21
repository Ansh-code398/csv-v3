import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import showdown from 'showdown';
import { autoPlay } from 'react-swipeable-views-utils';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Tooltip } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useRouter } from 'next/router';
import axios from 'axios';
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);


function StoryPreview({ scenes, max_scene, user, storyUserId, setEdit, edit, showIcons }) {
    const router = useRouter();
    const converter = new showdown.Converter();
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const [nxtTransistion, setNxtTransistion] = React.useState();
    const [nxtTransistionAnimEnabled, setNxtTransistionAnimEnabled] = React.useState();
    const maxSteps = max_scene;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
        setNxtTransistion(scenes[step].time);
        setNxtTransistionAnimEnabled(Boolean(scenes[step].animate) || false);
    };

    return (
        <Box
            sx={{
                minWidth: '100%',
                minHeight: '100%',
                maxWidth: '100%',
                margin: '0',
                padding: '0',
                width: '100%',
                display: 'flex',
                flex: '1',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <AutoPlaySwipeableViews
                // axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                animateTransitions={nxtTransistionAnimEnabled}
                index={activeStep}
                onChangeIndex={handleStepChange}
                // enableMouseEvents={true}
                interval={nxtTransistion}
                style={{ maxWidth: '100%', maxHeight: '100%', width: '100%', height: '100%' }}
            >
                {scenes.map((scence, index) => {
                    const bg_link = scence.bg_link
                    return (
                        <div id={"box_no" + (index + 1)} className="scence_box" style={{
                            backgroundImage: scence.bg_typ === "img" && `url(${bg_link ? bg_link : ''})`,
                            backgroundRepeat: 'no-repeat',
                            overflow: 'hidden',
                            objectFit: 'cover',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            maxHeight: '95%',
                            maxWidth: '100%',
                            flex: '1',
                            margin: 0
                        }} key={index}>
                            {activeStep === index && (
                                <>
                                    <div className={scence.class} style={{ maxWidth: '100%', maxHeight: '100%' }} dangerouslySetInnerHTML={{ __html: converter.makeHtml(scence.md_text) }} />
                                    {scence.bg_typ === "ytv" && (
                                        <div className='absolute -z-10 w-full h-full top-0 max-h-[95%]'>
                                            <iframe src={`https://youtube.com/embed/${bg_link?.split('youtube.com/embed/')[1] || 'dQw4w9WgXcQ'}?autoplay=1&mute=1&controls=0&color="white"&loop=1`} frameBorder="0" allow="autoplay; loop;" width="100%" height="100%"></iframe>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )
                })}
            </AutoPlaySwipeableViews>
            <MobileStepper
                steps={maxSteps}
                variant='text'
                position="static"
                activeStep={activeStep}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1}
                    >
                        Next
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeft />
                        ) : (
                            <KeyboardArrowRight />
                        )}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowRight />
                        ) : (
                            <KeyboardArrowLeft />
                        )}
                        Back
                    </Button>
                }
                
            />
            {showIcons && <div className="flex mt-2">
                {user?._id === storyUserId &&
                    <>
                        <Tooltip title="Edit Story">
                            <IconButton onClick={()=>{
                                setEdit(!edit)
                            }}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Story">
                            <IconButton onClick={() => {
                                axios.delete(`https://csv-v3-api.vercel.app/api/story/${router.query.id}/${user._id}`, {
                                    userId: user._id
                                }).then(res => {
                                    router.push('/')
                                }).catch(err => {
                                    console.log(err)
                                })
                            }}>
                                <DeleteForeverIcon />
                            </IconButton>
                        </Tooltip>
                    </>}
            </div>}
        </Box>
    );
}

export default StoryPreview;