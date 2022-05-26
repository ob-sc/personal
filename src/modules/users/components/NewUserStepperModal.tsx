import { ReactNode, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from 'src/common/components/Modal';
import Form from 'src/common/components/Form';

interface Props {
  open: boolean;
  onClose: () => void;
}

type StepperStep = { label: string; component: ReactNode; optional?: boolean };

const steps: StepperStep[] = [
  {
    label: 'Allgemeine Daten',
    component: (
      <Form
        fields={[{ name: 'poo', label: 'Poo' }]}
        onSubmit={async (values) => {
          console.log(values);
        }}
      />
    ),
  },
  { label: 'Hardware', component: <div>Hardware</div>, optional: true },
  { label: 'Berechtigungen', component: <div>Berechtigungen</div> },
];

// todo qlik & crent (kassenkonto) zu allgemeine daten oder berechtigungen?

// todo jeweils put, damit man zurück kann und der request idempotent ist

function NewUserStepperModal({ open, onClose }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());

  const isStepOptional = (step: StepperStep) => step.optional === true;

  const isStepSkipped = (step: number) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(steps[activeStep])) {
      throw new Error(
        'Unüberspringbarer Schritt kann nicht übersprungen werden.'
      );
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: '80vw',
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Stepper activeStep={activeStep}>
          {steps.map((stepObject, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: ReactNode;
            } = {};
            if (isStepOptional(stepObject)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={stepObject.label} {...stepProps}>
                <StepLabel {...labelProps}>{stepObject.label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {
          // Wenn alle Schritte fertig sind
          activeStep === steps.length ? (
            <>
              <Typography sx={{ mt: 2, mb: 1 }}>yay</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button
                  onClick={() => {
                    onClose();
                    setActiveStep(0);
                  }}
                >
                  Schließen
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Form
                noButton
                fillContainer
                onSubmit={async () => {
                  console.log('submit');
                }}
                fields={[{ name: 'poo', label: 'Poo' }]}
                render={(fields) => (
                  <Box sx={{ flex: '1 1 auto' }}>
                    {/* hier der Inhalt der Schritte */}
                    <>{fields}</>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        pt: 2,
                      }}
                    >
                      <Button
                        color="primary"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Zurück
                      </Button>
                      <Box sx={{ flex: '1 1 auto' }} />
                      {isStepOptional(steps[activeStep]) && (
                        <Button
                          color="primary"
                          onClick={handleSkip}
                          sx={{ mr: 1 }}
                        >
                          Überspringen
                        </Button>
                      )}
                      {/* todo disabled wenn nicht-optionaler schritt nicht erledigt */}
                      <Button onClick={handleNext}>
                        {activeStep === steps.length - 1 ? 'Fertig' : 'Weiter'}
                      </Button>
                    </Box>
                  </Box>
                )}
              />
            </>
          )
        }
      </Box>
    </Modal>
  );
}

export default NewUserStepperModal;
