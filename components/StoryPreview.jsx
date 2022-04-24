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
import { injectStyle } from "react-toastify/dist/inject-style";
import { motion } from "framer-motion"
import { toast, ToastContainer } from 'react-toastify';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);



function StoryPreview({ scenes, max_scene, user, storyUserId, setEdit, edit, showIcons, otherUserIds }) {
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
    React.useEffect(() => {
        injectStyle();
    }, []);

    const canEdit = () => {
        return user && (user?._id === storyUserId || otherUserIds?.find(id => id === user?._id))
    }
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
                animateTransitions={nxtTransistionAnimEnabled}
                index={activeStep}
                onChangeIndex={handleStepChange}
                interval={nxtTransistion}
                style={{ maxWidth: '100%', maxHeight: '100%', width: '100%', height: '100%' }}
            >
                {scenes.map((scence, index) => {
                    const bg_link = scence.bg_link
                    return (
                        <motion.div id={"box_no" + (index + 1)} className="scence_box"
                            initial="hidden"
                            hidden={index !== activeStep}
                            whileInView="visible"
                            style={{
                                backgroundImage: scence.bg_typ === "img" && `url(${bg_link ? bg_link : ''})`,
                                backgroundRepeat: 'no-repeat',
                                overflow: 'hidden',
                                objectFit: 'cover',
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                maxHeight: '95%',
                                maxWidth: '100%',
                                flex: '1',
                                margin: 0,
                            }} key={index}>
                            {activeStep === index && (
                                <>
                                    <motion.div animate={{
                                        opacity: 1,
                                        transform: 'translateX(0%)',
                                        transition: {
                                            delay: 1,
                                            duration: 0.5,
                                            ease: "easeInOut"
                                        }
                                    }} className={scence.class} style={{ maxWidth: '100%', maxHeight: '100%', minHeight: '90%', minWidth: '100%', opacity: '0', transform: `translateX(${Math.floor(Math.random() * (200 - 500)) + 200}%)` }} dangerouslySetInnerHTML={{ __html: converter.makeHtml(scence.md_text) }} />
                                </>
                            )}
                            {scence.bg_typ === "ytv" && (
                                <div className='absolute -z-10 w-full h-full top-0 max-h-[95%]'>
                                    <iframe src={`https://youtube.com/embed/${bg_link?.split('youtube.com/embed/')[1] || 'dQw4w9WgXcQ'}?&playlist=${bg_link?.split('youtube.com/embed/')[1] || 'dQw4w9WgXcQ'}&autoplay=1&mute=1&color="white"&loop=1&rel=0&modestbranding=1&autohide=1&showinfo=0&controls=0`} frameBorder="0" allow="autoplay; loop;" width="100%" height="100%"></iframe>
                                </div>
                            )}
                        </motion.div>
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
                {canEdit() &&
                    <>
                        <Tooltip title="Edit Story">
                            <IconButton onClick={() => {
                                setEdit(!edit)
                            }}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        {user?._id === storyUserId &&
                            <>
                                <Tooltip title="Delete Story">
                                    <IconButton onClick={() => {
                                        console.log(user?._id, storyUserId)
                                        const t = toast.loading('Deleting Story...');
                                        axios.delete(`https://csv-v3-api.vercel.app/api/story/${router.query.id}/${user._id}`).then(res => {
                                            router.push('/')
                                            toast.update(t, { render: "Deleted Story...", type: "success", isLoading: false, autoClose: 2000 });
                                        }).catch(err => {
                                            console.log(err)
                                            toast.update(t, { render: "Error in Deleting Story...", type: "error", isLoading: false, autoClose: 3000 });
                                        })
                                    }}>
                                        <DeleteForeverIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Add Team Member">
                                    <IconButton onClick={async () => {
                                        const memEmail = await prompt("Enter Email of Member to Add");
                                        const t = toast.loading('Adding New Member...');
                                        if (!memEmail) return toast.update(t, { render: "No Email Entered...", type: "error", isLoading: false, autoClose: 3000 });
                                        const memId = await axios.get(`https://csv-v3-api.vercel.app/api/users/email/id/${memEmail}`).catch(err => { });
                                        if (!memId?.data) return toast.update(t, { render: "User not found...", type: "error", isLoading: false, autoClose: 3000 });

                                        axios.post(`https://csv-v3-api.vercel.app/api/story/${router.query.id}/team`, {
                                            mainUserId: user._id,
                                            otherUserId: memId.data._id
                                        }).then(res => {
                                            toast.update(t, { render: "Added Member...", type: "success", isLoading: false, autoClose: 2000 });
                                        }).catch(err => {
                                            console.log(err)
                                            toast.update(t, { render: "Error in Adding Member...", type: "error", isLoading: false, autoClose: 3000 });
                                        })
                                    }}>
                                        <AccountCircleIcon />
                                    </IconButton>
                                </Tooltip>
                            </>}
                        <ToastContainer />
                    </>}
            </div>}
        </Box>
    );
}

export default StoryPreview;