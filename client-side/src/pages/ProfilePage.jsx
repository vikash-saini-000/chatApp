import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const ProfilePage = () => {

  const navigate = useNavigate();

  const { authUser, updateProfile } = useContext(AuthContext);

  const [name, setName] = useState(
    authUser?.fullName || "Martin Johnson"
  );

  const [selectedImg, setSelectedImg] = useState(null);

  const [bio, setBio] = useState(
    authUser?.bio || "Hi there"
  );

  const [loading, setLoading] = useState(false);

  // IMAGE PREVIEW
  const [showImage, setShowImage] = useState(false);

  // HANDLE IMAGE
  const handleFileChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    // SIZE CHECK
    if (file.size > 2 * 1024 * 1024) {

      toast.error(
        "Image size must be less than 2MB",
        {
          duration: 2500,
        }
      );

      return;
    }

    setSelectedImg(file);

    toast.success(
      "Profile image selected",
      {
        duration: 2000,
      }
    );
  };

  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      if (selectedImg) {

        const reader = new FileReader();

        reader.readAsDataURL(selectedImg);

        reader.onload = async () => {

          const base64Image = reader.result;

          await updateProfile({
            profilePic: base64Image,
            fullName: name,
            bio
          });

          setLoading(false);

          navigate('/');
        };

      } else {

        await updateProfile({
          fullName: name,
          bio
        });

        setLoading(false);

        navigate('/');
      }

    } catch (error) {

      toast.error(
        "Failed to update profile",
        {
          duration: 2500,
        }
      );

      setLoading(false);

    }
  };

  return (

    <div className="
      min-h-screen
      w-full
      bg-cover
      bg-no-repeat
      flex
      items-center
      justify-center
      sm:p-5
      relative
      overflow-hidden
    ">

      {/* LOADING OVERLAY */}
      {loading && (

        <div className="
          fixed inset-0
          bg-black/60
          backdrop-blur-xl
          flex items-center justify-center
          z-50
        ">

          <div className="flex flex-col items-center">

            <div className="flex space-x-3">
              <span className="w-4 h-4 bg-white rounded-full animate-bounce"></span>
              <span className="w-4 h-4 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-4 h-4 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>

            <p className="text-white text-sm mt-4">
              Updating profile...
            </p>

          </div>

        </div>

      )}

      {/* MAIN CARD */}
      <div className="
        w-full
        h-screen
        sm:h-auto
        sm:max-w-4xl
        backdrop-blur-2xl
        bg-white/10
        border-0
        sm:border
        border-white/20
        text-gray-300
        flex
        flex-col-reverse
        md:flex-row
        items-center
        justify-between
        rounded-none
        sm:rounded-3xl
        shadow-2xl
        overflow-y-auto
      ">

        {/* FORM */}
        <form
          className="
            flex
            flex-col
            gap-5
            p-6
            sm:p-10
            flex-1
            w-full
          "
          onSubmit={handleSubmit}
        >

          <div>

            <h2 className="text-3xl font-bold text-white">
              Profile Details
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Update your personal information
            </p>

          </div>

          {/* UPLOAD */}
          <label
            htmlFor="avatar"
            className="
              flex
              items-center
              gap-4
              cursor-pointer
              bg-white/5
              border
              border-white/10
              rounded-2xl
              p-4
              hover:bg-white/10
              transition
            "
          >

            <input
              onChange={handleFileChange}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />

            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : authUser?.profilePic || assets.avatar_icon
              }
              alt="avatar"
              className="
                w-16
                h-16
                rounded-full
                object-cover
                border-2
                border-violet-500
              "
            />

            <div>

              <p className="text-white font-medium">
                Upload profile photo
              </p>

              <span className="text-xs text-gray-400">
                PNG, JPG up to 2MB
              </span>

            </div>

          </label>

          {/* NAME */}
          <div className="flex flex-col gap-2">

            <label className="text-sm text-gray-300">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className='
                p-3
                bg-white/5
                border
                border-gray-500
                rounded-xl
                text-white
                focus:outline-none
                focus:ring-2
                focus:ring-violet-500
              '
            />

          </div>

          {/* BIO */}
          <div className="flex flex-col gap-2">

            <label className="text-sm text-gray-300">
              Bio
            </label>

            <textarea
              placeholder='Write your bio here...'
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              rows={4}
              className='
                p-3
                bg-white/5
                border
                border-gray-500
                rounded-xl
                text-white
                resize-none
                focus:outline-none
                focus:ring-2
                focus:ring-violet-500
              '
            />

          </div>

          {/* BUTTON */}
          <button
            type='submit'
            disabled={loading}
            className='
              bg-gradient-to-r
              from-purple-400
              to-violet-600
              text-white
              p-3
              rounded-full
              text-lg
              cursor-pointer
              hover:scale-[1.02]
              active:scale-[0.98]
              transition-all
              duration-300
              shadow-lg
              disabled:opacity-50
              disabled:cursor-not-allowed
              mt-2
            '
          >

            {loading
              ? "Saving..."
              : "Save Changes"}

          </button>

        </form>

        {/* RIGHT IMAGE */}
        <div className="
          flex
          items-center
          justify-center
          pt-10
          sm:p-10
          relative
        ">

          <img
            src={
              selectedImg
                ? URL.createObjectURL(selectedImg)
                : authUser?.profilePic || assets.logo_icon
            }
            alt="profile"
            onClick={() => setShowImage(true)}
            className="
              w-36
              h-36
              sm:w-60
              sm:h-60
              object-cover
              rounded-full
              border-4
              border-violet-500/40
              shadow-2xl
              cursor-pointer
              hover:scale-105
              transition-all
              duration-300
            "
          />

        </div>

      </div>

      {/* IMAGE PREVIEW */}
      {showImage && (

        <div
          className='
            fixed
            inset-0
            z-[100]
            bg-black/80
            backdrop-blur-md
            flex
            items-center
            justify-center
            p-5
          '
        >

          {/* CLOSE */}
          <button
            onClick={() => setShowImage(false)}
            className='
              absolute
              top-5
              right-5
              text-white
              text-5xl
              hover:scale-110
              transition
            '
          >
            ×
          </button>

          {/* IMAGE */}
          <img
            src={
              selectedImg
                ? URL.createObjectURL(selectedImg)
                : authUser?.profilePic || assets.logo_icon
            }
            alt='preview'
            className='
              max-w-full
              max-h-[90vh]
              rounded-3xl
              shadow-2xl
              object-contain
            '
          />

        </div>

      )}

    </div>
  );
};

export default ProfilePage;