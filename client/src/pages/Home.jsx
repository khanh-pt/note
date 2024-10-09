import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import CustomDropdown from "../components/CustomDropdown";
import FolderList from "../components/FolderList";
import CustomTypography from "../components/CustomTypography";

export default function Home() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <div className="flex items-center justify-between mt-4">
        <CustomTypography variant="h1" className="text-[20px] font-bold">
          Note App
        </CustomTypography>
        <CustomDropdown
          items={
            <>
              <li>1</li>
              <li>2</li>
              <li>3</li>
            </>
          }
        >
          <div className="flex items-center gap-[5px]">
            <div className="w-[30px] h-[30px]">
              <img
                src={`${user.photoURL}`}
                alt="avatar"
                className="rounded-full"
              />
            </div>
            <div>{user.displayName}</div>
          </div>
        </CustomDropdown>
      </div>
      <div className="mt-4">
        <FolderList />
      </div>
    </>
  );
}
