import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, MapPin, Calendar, QrCode } from "lucide-react";

const CreatingEvents = () => {
  return (
    <HelpLayout>
      <div className="max-w-4xl">
        <Link to="/help/events" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Plus className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Creating events</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Set up field events to track offline marketing impact with Event Halo.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Creating a new event</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Navigate to <strong>Events</strong> from the sidebar</li>
            <li>Click the <strong>Create Event</strong> button</li>
            <li>Fill in the event details form</li>
            <li>Click <strong>Create</strong> to save</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Required fields</h2>
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-amber-100 rounded">
                  <Calendar className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900">Event name</p>
                  <p className="text-sm text-zinc-500">e.g., "SaaStr Annual 2025"</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-amber-100 rounded">
                  <MapPin className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900">Event city</p>
                  <p className="text-sm text-zinc-500">City where the event takes place</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-amber-100 rounded">
                  <Calendar className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900">Start & end dates</p>
                  <p className="text-sm text-zinc-500">Event duration for traffic analysis</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Optional settings</h2>
          <ul className="list-disc list-inside space-y-3 text-zinc-600 mb-6">
            <li><strong>Control city:</strong> A similar city with no event for baseline comparison</li>
            <li><strong>Booth link:</strong> Associate a specific utm.one link with this event</li>
            <li><strong>Expected attendance:</strong> For ROI calculations</li>
            <li><strong>Event budget:</strong> Total spend for ROI tracking</li>
          </ul>

          <ProTip>
            Create your event in utm.one at least a few days before it starts. This ensures 
            we capture baseline traffic data for accurate lift calculations.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Creating booth materials</h2>
          <p className="text-zinc-600 mb-4">
            After creating your event, generate booth materials:
          </p>
          <div className="bg-white border border-zinc-200 rounded-xl p-4 my-6">
            <QrCode className="h-5 w-5 text-amber-600 mb-2" />
            <h4 className="font-medium text-zinc-900 mb-2">Event QR code</h4>
            <p className="text-sm text-zinc-600 mb-3">
              Generate a QR code with built-in UTM parameters:
            </p>
            <code className="text-xs bg-zinc-100 px-2 py-1 rounded block">
              utm_source=event&utm_medium=booth&utm_campaign=saastr-2025
            </code>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Event status</h2>
          <p className="text-zinc-600 mb-4">
            Events have three status states:
          </p>
          <div className="grid md:grid-cols-3 gap-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="w-2 h-2 bg-amber-500 rounded-full mb-2" />
              <h4 className="font-medium text-zinc-900 mb-1">Upcoming</h4>
              <p className="text-sm text-zinc-600">Event hasn't started yet</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mb-2 animate-pulse" />
              <h4 className="font-medium text-zinc-900 mb-1">Active</h4>
              <p className="text-sm text-zinc-600">Event is currently running</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="w-2 h-2 bg-zinc-400 rounded-full mb-2" />
              <h4 className="font-medium text-zinc-900 mb-1">Completed</h4>
              <p className="text-sm text-zinc-600">Event has ended</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Best practices</h2>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Use consistent naming (e.g., "Conference Name - Year")</li>
            <li>Select the most specific city possible</li>
            <li>Include setup/teardown days if you're running activities</li>
            <li>Choose control cities with similar industry presence</li>
          </ul>
        </div>
      </div>
    </HelpLayout>
  );
};

export default CreatingEvents;
