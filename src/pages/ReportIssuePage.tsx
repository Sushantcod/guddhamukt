import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Camera, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useIssues } from '../hooks/useIssues';
import { useGeolocation } from '../hooks/useGeolocation';
import { useDuplicateDetection } from '../hooks/useDuplicateDetection';
import { CivicMode, IssueCategory, IssueSeverity } from '../types';
import { CameraUpload } from '../components/report/CameraUpload';
import { LocationCapture } from '../components/report/LocationCapture';
import { IssueForm } from '../components/report/IssueForm';
import { DuplicateMatchModal } from '../components/report/DuplicateMatchModal';
import { PageHeader } from '../components/layout/PageHeader';
import { generateComplaintId } from '../utils/issueHelpers';
import { URBAN_LOCATION } from '../data/mockLocations';

export const ReportIssuePage: React.FC = () => {
  const navigate = useNavigate();
  const { issues, addIssue, confirmIssue } = useIssues();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [civicMode, setCivicMode] = useState<CivicMode>('urban');

  // Form State
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80'
  );
  const [address, setAddress] = useState<string>('Outer Ring Road, Bellandur Junction');
  const [landmark, setLandmark] = useState<string>('Near Shell Fuel Station');
  const [wardOrVillage, setWardOrVillage] = useState<string>(URBAN_LOCATION.subdivisions[0]);

  const [category, setCategory] = useState<IssueCategory>('Pothole');
  const [severity, setSeverity] = useState<IssueSeverity>('High');
  const [title, setTitle] = useState<string>('Deep Hazardous Pothole in Bus Lane');
  const [description, setDescription] = useState<string>(
    'Asphalt crater measuring 3ft wide by 6in deep. Vehicles swerving sharply to avoid impact.'
  );
  const [reporterName, setReporterName] = useState<string>('');

  // Geolocation
  const {
    latitude,
    longitude,
    accuracy,
    loading: isLocating,
    error: locationError,
    detectLocation,
    setManualLocation,
  } = useGeolocation(civicMode);

  // Duplicate Detection Hook
  const { duplicateResult, isModalOpen, checkForDuplicate, closeModal } =
    useDuplicateDetection(issues);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedIssueId, setSubmittedIssueId] = useState<string | null>(null);

  const handleNextStep = () => {
    if (step === 1) {
      if (!photoUrl) {
        alert('Please attach or choose a photo of the road issue.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!address.trim()) {
        alert('Please provide a street or road name.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!title.trim() || !description.trim()) {
        alert('Please fill out the issue headline and description.');
        return;
      }

      // Check for duplicates before moving to step 4
      const dupCheck = checkForDuplicate(latitude, longitude, category);
      if (!dupCheck.isDuplicate) {
        setStep(4);
      }
    }
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const newId = generateComplaintId();
      const assignedDept =
        civicMode === 'urban'
          ? 'BBMP Major Roads Infrastructure & Maintenance Wing'
          : 'State Rural Roads Development Agency (SRRDA) / Gram Panchayat';

      const newIssue = addIssue({
        id: newId,
        title,
        description,
        category,
        severity,
        mode: civicMode,
        wardOrVillage,
        address,
        landmark,
        latitude,
        longitude,
        photoUrl,
        assignedDepartment: assignedDept,
        reporterName: reporterName.trim() || 'Citizen Reporter',
        status: 'Reported',
      });

      setSubmittedIssueId(newIssue.id);
      setIsSubmitting(false);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }, 600);
  };

  const handleConfirmExistingAndRedirect = (issueId: string) => {
    confirmIssue(issueId);
    closeModal();
    navigate(`/issues/${issueId}`);
  };

  const handleContinueWithNewIssue = () => {
    closeModal();
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      <PageHeader
        title="Report Road Hazard"
        subtitle="Submit geo-tagged photographic evidence to initiate executive municipal dispatch."
        backHref="/"
        backLabel="Back to Map"
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6">
        {submittedIssueId ? (
          /* Submission Success State */
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center space-y-6 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                Ticket Created & Simulated Route Assigned
              </span>
              <h2 className="text-2xl font-extrabold text-[#123C69] mt-3">
                Road Issue Successfully Logged!
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Your report has been assigned statutory docket tracking number{' '}
                <strong className="text-slate-900 font-mono">#{submittedIssueId}</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase">Location:</span>
                <span className="text-slate-800 font-medium">{address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase">Category / Severity:</span>
                <span className="text-slate-800 font-bold">
                  {category} ({severity})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase">Initial Status:</span>
                <span className="text-blue-700 font-bold">Reported (Simulated Route)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate(`/issues/${submittedIssueId}`)}
                className="w-full sm:w-auto px-6 py-3 bg-[#123C69] hover:bg-[#00264b] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-sm"
              >
                View Issue & Escalation Trail &rarr;
              </button>
              <button
                onClick={() => navigate(`/track/${submittedIssueId}`)}
                className="w-full sm:w-auto px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-sm"
              >
                Track Complaint & Download PDF
              </button>
            </div>
          </div>
        ) : (
          /* 4-Step Wizard Container */
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            {/* Step Progress Header */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5">
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-extrabold">
                <div
                  className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 ${
                    step === 1
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : step > 1
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-white text-slate-400 border-slate-200'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">1. Photo</span>
                </div>

                <div
                  className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 ${
                    step === 2
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : step > 2
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-white text-slate-400 border-slate-200'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">2. Location</span>
                </div>

                <div
                  className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 ${
                    step === 3
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : step > 3
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-white text-slate-400 border-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">3. Hazard</span>
                </div>

                <div
                  className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 ${
                    step === 4
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white text-slate-400 border-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">4. Submit</span>
                </div>
              </div>
            </div>

            {/* Step Body */}
            <div className="p-6 sm:p-8">
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#123C69]">
                      Step 1: Capture or Upload Road Hazard Image
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Visual photographic evidence is mandatory to prevent frivolous reports and initiate contractor DLP checks.
                    </p>
                  </div>
                  <CameraUpload photoUrl={photoUrl} onPhotoChange={setPhotoUrl} />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#123C69]">
                      Step 2: Road Location & Jurisdiction
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Accurate geo-coordinates map the defect directly to the responsible engineering sub-division.
                    </p>
                  </div>
                  <LocationCapture
                    mode={civicMode}
                    onModeChange={setCivicMode}
                    latitude={latitude}
                    longitude={longitude}
                    accuracy={accuracy}
                    isLocating={isLocating}
                    locationError={locationError}
                    onDetectLocation={detectLocation}
                    onManualPinChange={setManualLocation}
                    address={address}
                    onAddressChange={setAddress}
                    landmark={landmark}
                    onLandmarkChange={setLandmark}
                    wardOrVillage={wardOrVillage}
                    onWardChange={setWardOrVillage}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#123C69]">
                      Step 3: Defect Specifics & Safety Risk
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Categorize the physical road failure and identify hazard intensity.
                    </p>
                  </div>
                  <IssueForm
                    title={title}
                    onTitleChange={setTitle}
                    category={category}
                    onCategoryChange={setCategory}
                    severity={severity}
                    onSeverityChange={setSeverity}
                    description={description}
                    onDescriptionChange={setDescription}
                    reporterName={reporterName}
                    onReporterNameChange={setReporterName}
                  />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-5 animate-in fade-in">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#123C69]">
                      Step 4: Review Complaint & Confirm Submission
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Verify report details before initiating statutory civic workflow.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={photoUrl}
                        alt="Preview"
                        className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {civicMode} • {category} • {severity}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900">{title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-1">{address}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-200/80">
                      <div>
                        <span className="text-slate-400 font-bold uppercase text-[10px] block">
                          Coordinates:
                        </span>
                        <span className="font-mono text-slate-700">
                          {latitude.toFixed(5)}° N, {longitude.toFixed(5)}° E
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold uppercase text-[10px] block">
                          Ward / Village:
                        </span>
                        <span className="font-semibold text-slate-700">{wardOrVillage}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step Navigation Controls */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => (prev - 1) as any)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-extrabold transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#123C69] hover:bg-[#00264b] text-white text-xs font-extrabold transition-all shadow-sm"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-extrabold transition-all shadow-md"
                >
                  {isSubmitting ? (
                    <span>Registering Ticket...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Grievance</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Duplicate Modal */}
        {duplicateResult.isDuplicate && duplicateResult.matchedIssue && (
          <DuplicateMatchModal
            isOpen={isModalOpen}
            onClose={closeModal}
            matchedIssue={duplicateResult.matchedIssue}
            distanceMeters={duplicateResult.distanceMeters || 42}
            onConfirmExisting={handleConfirmExistingAndRedirect}
            onContinueNew={handleContinueWithNewIssue}
          />
        )}
      </main>
    </div>
  );
};
