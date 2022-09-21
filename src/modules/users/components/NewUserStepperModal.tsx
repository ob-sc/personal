import { ReactNode, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from 'src/common/components/Modal';
import Form from 'src/common/components/Form';
import { FormField, SelectOption } from 'src/common/types/client';
import { DomainUser } from 'src/modules/ldap/types';

interface Props {
  open: boolean;
  onClose: () => void;
  users: DomainUser[];
}

type StepperStep = { label: string; component: ReactNode; optional?: boolean };

function NewUserStepperModal({ open, onClose, users }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [locationOptions, setLocationOptions] = useState<SelectOption[]>([]);

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

  useEffect(() => {
    const uniqueLocations = users
      .map((user) => {
        const [, cn] = user.distinguishedName.split(',OU'); // name kann komma enthalten, deshalb bis ,OU splitten fuer CN=
        const [, loc] = cn.split('='); // CN= rausnehmen, nur Inhalt
        return loc;
      })
      .filter((value, index, self) => self.indexOf(value) === index) // nur unique
      .sort() // alphabetisch sortieren
      .map((location) => ({
        optval: location,
        optlabel: String(location),
      })); // optionsobjekt (SelectOption) draus machen
    setLocationOptions(uniqueLocations);
  }, [users]);

  const generalFields: FormField[] = [
    { name: 'h0', label: 'Allgemeine Daten', type: 'header' },
    { name: 'first_name', label: 'Vorname', required: true },
    { name: 'last_name', label: 'Nachname', required: true },
    { name: 'position', label: 'Position', required: true },
    {
      name: 'location',
      label: 'Station / Abteilung',
      type: 'select',
      selOptions: locationOptions,
      required: true,
    },
    { name: 'entry_date', label: 'Eintritt', type: 'date', required: true },
    // { name: 'h1', label: 'Optional', type: 'header' },
    { name: 'crent_register', label: 'C-Rent Kassenkonto', type: 'check' },
    { name: 'qlik', label: 'Qlik', type: 'check' },
  ];

  const steps: StepperStep[] = [
    {
      label: 'Allgemeine Daten',
      component: (
        <Form
          cols={3}
          fullWidth
          noButton
          formId="new-user-form"
          fields={generalFields}
          onSubmit={async (values) => {
            console.log(values);
            handleNext();
          }}
        />
      ),
    },
    {
      label: 'Hardware',
      component: (
        <Form
          noButton
          formId="new-user-form"
          fields={[{ name: 'poo', label: 'Hardware' }]}
          onSubmit={async (values) => {
            console.log(values);
            handleNext();
          }}
        />
      ),
      optional: true,
    },
    {
      label: 'Zusammenfassung',
      component: <>cool</>,
    },
  ];

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
          gap: 3,
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
              {/* hier der Inhalt der Schritte */}
              <Box sx={{ flex: '1 1 auto' }}>{steps[activeStep].component}</Box>
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
                  <Button color="primary" onClick={handleSkip} sx={{ mr: 1 }}>
                    Überspringen
                  </Button>
                )}
                {/* todo disabled wenn nicht-optionaler schritt nicht erledigt */}
                <Button type="submit" form="new-user-form">
                  {activeStep === steps.length - 1 ? 'Fertig' : 'Weiter'}
                </Button>
              </Box>
            </>
          )
        }
      </Box>
    </Modal>
  );
}

export default NewUserStepperModal;
