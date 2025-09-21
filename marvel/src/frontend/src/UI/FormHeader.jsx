import { Briefcase } from "lucide-react";
function FormHeader() {
  return (
    <div className="text-center">
      <div className="flex justify-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
          <Briefcase className="h-8 w-8 text-white" />
        </div>
      </div>
      <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
        Create your account
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Join TalentMatch AI and find your perfect match
      </p>
    </div>
  );
}

export default FormHeader;
