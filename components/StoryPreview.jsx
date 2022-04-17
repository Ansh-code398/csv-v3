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

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);


function StoryPreview({ scenes, max_scene }) {
    const converter = new showdown.Converter();
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const [nxtTransistion, setNxtTransistion] = React.useState();
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
    };

    return (
        <Box
            sx={{
                minWidth: '100%',
                minHeight: '100%',
                maxWidth: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}              
        >
            <AutoPlaySwipeableViews
                // axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents={true}
                interval={nxtTransistion}
                style={{maxWidth: '100%', maxHeight: '100%'}}
            >
                {scenes.map((scence, index) => {
                    const bg_link = scence.bg_link
                    return (
                        <div id={"box_no" + (index + 1)} className="scence_box" style={{
                            backgroundImage: `url(${bg_link ? bg_link : ''})`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            overflow: 'hidden',
                            objectFit: 'cover',
                            backgroundPosition: 'center',                         
                        }} key={index}>
                            <div className={scence.class} style={{maxWidth: '100%', maxHeight: '100%'}} dangerouslySetInnerHTML={{ __html: converter.makeHtml(scence.md_text) }} />
                        </div>
                    )
                })}
            </AutoPlaySwipeableViews>
            <MobileStepper
                steps={maxSteps}
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
        </Box>
    );
}

export default StoryPreview;