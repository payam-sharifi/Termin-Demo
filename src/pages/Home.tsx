import { BookingWizard } from "../components/booking/BookingWizard";

export function Home() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <BookingWizard />
    </div>
  );
}
