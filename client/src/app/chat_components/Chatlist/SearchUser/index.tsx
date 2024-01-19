/* eslint-disable import/extensions */
/* eslint-disable react-hooks/exhaustive-deps */
import { setProfile, setSearchPage } from "@/redux/features/interfaceSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getUsers } from "@/services/contacts.service";
import { ArrowBack, Search, Send } from "@mui/icons-material";
import { useState } from "react";
import SearchUserListItem from "../SearchUserListItem";
function SearchUser() {
  const [users, setUsers] = useState<ContactInfo[]>([]);
  const [profileId, setProfileId] = useState<string>("");
  const userData = useAppSelector((state) => state.userReducer.userData);
  const dispatch = useAppDispatch();

  const getUsersBySearch = async (search: string) => {
    if (search.length == 0) setUsers([]);
    if (userData !== undefined && search.length > 0) {
      const response = await getUsers(search, userData.id);
      if (response?.data.ok) {
        setUsers(response.data.usersFiltered);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className=" flex items-center h-16 px-4 py-3">
        <div className="flex items-center gap-2 text-[--text-primary]">
          <button onClick={() => {}}>
            <ArrowBack
              className="cursor-pointer text-xl"
              onClick={() => dispatch(setSearchPage())}
            />
          </button>
          <span>Search users</span>
        </div>
      </div>
      <div className="bg-[var(--search-input-container-background)] h-full flex-auto overflow-auto custom-scrollbar">
        <div className="flex flex-col py-3 items-center gap-3  mx-4">
          <div className="bg-[var(--panel-header-background)] w-full mx-3 flex items-center gap-5 px-3 py-1 rounded-lg flex-grow ">
            <div>
              <Search className="text-[var(--panel-header-icon)] cursor-pointer text-l" />
            </div>
            <div className="flex w-full justify-between items-center">
              <input
                placeholder="Search user by ID"
                name="search"
                onChange={(e) => setProfileId(e.target.value)}
                className="bg-transparent text-sm outline-none  text-[var(--text-primary)]"
              />
              <Send
                className="  text-[--text-primary]  cursor-pointer "
                titleAccess="Send search"
                onClick={() => dispatch(setProfile({ show: true, profileId }))}
              />
            </div>
          </div>
          <div className="flex w-full items-center gap-2">
            <hr className="border-[--panel-header-icon]  w-full" />
            <span className="text-[--panel-header-icon]">or </span>
            <hr className="border-[--panel-header-icon]  w-full" />
          </div>

          <div className="bg-[var(--panel-header-background)] w-full flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4">
            <div>
              <Search className="text-[var(--panel-header-icon)] cursor-pointer text-l" />
            </div>
            <div>
              <input
                placeholder="Search user by username "
                name="search"
                onChange={(e) => getUsersBySearch(e.target.value)}
                className="bg-transparent text-sm outline-none text-[var(--text-primary)]"
              />
            </div>
          </div>
        </div>
        {users &&
          users.map((cont) => {
            return <SearchUserListItem data={cont} key={cont.id} />;
          })}
      </div>
    </div>
  );
}

export default SearchUser;
