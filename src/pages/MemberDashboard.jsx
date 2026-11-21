import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  LockKeyhole,
  LogOut,
  Mail,
  ShieldCheck,
  User,
  Upload,
  Camera,
  X,
  Pencil,
  Save,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../lib/supabase';

export default function MemberDashboard() {
  const {
    user,
    profile,
    signOut,
    updatePassword,
    updateEmail,
    refreshProfile,
  } = useAuth();

  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // -----------------------------
  // PROFILE EDITING
  // -----------------------------
  const [editingProfile, setEditingProfile] = useState(false);

  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || '',
    membership_type: profile?.membership_type || 'Student',
    affiliation: profile?.affiliation || '',
    department: profile?.department || '',
    year: profile?.year || '',
    profession: profile?.profession || '',
    interests: profile?.interests || '',
    preferred_contribution: profile?.preferred_contribution || '',
    phone: profile?.phone || '',
  });

  const [profileBusy, setProfileBusy] = useState(false);

  // -----------------------------
  // PHOTO
  // -----------------------------
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(
    profile?.photo_url || ''
  );
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState('');

  // -----------------------------
  // PROFILE FORM HELPERS
  // -----------------------------
  const startEditingProfile = () => {
    setError('');
    setMessage('');

    setProfileForm({
      full_name: profile?.full_name || '',
      membership_type: profile?.membership_type || 'Student',
      affiliation: profile?.affiliation || '',
      department: profile?.department || '',
      year: profile?.year || '',
      profession: profile?.profession || '',
      interests: profile?.interests || '',
      preferred_contribution: profile?.preferred_contribution || '',
      phone: profile?.phone || '',
    });

    setEditingProfile(true);
  };

  const cancelEditingProfile = () => {
    setEditingProfile(false);
    setError('');
    setMessage('');

    setProfileForm({
      full_name: profile?.full_name || '',
      membership_type: profile?.membership_type || 'Student',
      affiliation: profile?.affiliation || '',
      department: profile?.department || '',
      year: profile?.year || '',
      profession: profile?.profession || '',
      interests: profile?.interests || '',
      preferred_contribution: profile?.preferred_contribution || '',
      phone: profile?.phone || '',
    });
  };

  const handleProfileChange = (field, value) => {
    setProfileForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveProfile = async () => {
    if (!user?.id) return;

    setProfileBusy(true);
    setError('');
    setMessage('');

    try {
      // IMPORTANT:
      // "role" is deliberately NOT included here.
      // Members cannot change their member/admin role.
      const updates = {
        full_name: profileForm.full_name.trim(),
        membership_type: profileForm.membership_type,
        affiliation: profileForm.affiliation.trim(),
        department: profileForm.department.trim(),
        year: profileForm.year.trim(),
        profession: profileForm.profession.trim(),
        interests: profileForm.interests.trim(),
        preferred_contribution:
          profileForm.preferred_contribution.trim(),
        phone: profileForm.phone.trim(),
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (updateError) throw updateError;

      if (refreshProfile) {
        await refreshProfile();
      }

      setEditingProfile(false);
      setMessage('Profile information updated successfully.');
    } catch (e) {
      setError(e.message || 'Unable to update your profile.');
    } finally {
      setProfileBusy(false);
    }
  };

  // -----------------------------
  // EMAIL
  // -----------------------------
  const changeEmail = async () => {
    setBusy(true);
    setError('');
    setMessage('');

    try {
      await updateEmail(email);
      setMessage(
        'A verification message was sent to your new email address.'
      );
    } catch (e) {
      setError(e.message || 'Unable to change email.');
    } finally {
      setBusy(false);
    }
  };

  // -----------------------------
  // PASSWORD
  // -----------------------------
  const changePassword = async () => {
    setBusy(true);
    setError('');
    setMessage('');

    try {
      await updatePassword(password);
      setPassword('');
      setMessage('Password updated successfully.');
    } catch (e) {
      setError(e.message || 'Unable to update password.');
    } finally {
      setBusy(false);
    }
  };

  // -----------------------------
  // PHOTO SELECT
  // -----------------------------
  const handlePhotoSelect = (e) => {
    setPhotoError('');
    setMessage('');

    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please choose an image file.');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Please choose an image smaller than 5 MB.');
      e.target.value = '';
      return;
    }

    setPhotoFile(file);

    const reader = new FileReader();

    reader.onload = (event) => {
      setPhotoPreview(event.target?.result || '');
    };

    reader.readAsDataURL(file);
  };

  const removeSelectedPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(profile?.photo_url || '');
    setPhotoError('');
    setMessage('');
  };

  // -----------------------------
  // PHOTO UPLOAD
  // -----------------------------
  const uploadPhoto = async () => {
    if (!user?.id || !photoFile) {
      setPhotoError('Please choose a photo first.');
      return;
    }

    setPhotoBusy(true);
    setPhotoError('');
    setMessage('');

    try {
      const extension =
        photoFile.name.split('.').pop()?.toLowerCase() || 'jpg';

      const filePath = `members/${user.id}/${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from('eac-media')
        .upload(filePath, photoFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: photoFile.type,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('eac-media')
        .getPublicUrl(filePath);

      const photoUrl = publicUrlData?.publicUrl;

      if (!photoUrl) {
        throw new Error('Unable to create the public photo URL.');
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          photo_url: photoUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setPhotoFile(null);
      setPhotoPreview(photoUrl);
      setMessage('Profile photo updated successfully.');

      if (refreshProfile) {
        await refreshProfile();
      }
    } catch (e) {
      setPhotoError(
        e.message || 'Unable to upload your profile photo.'
      );
    } finally {
      setPhotoBusy(false);
    }
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const logout = async () => {
    await signOut();
  };

  return (
    <section className="dashboard-page">
      <div className="container">

        {/* =========================
            DASHBOARD HEADER
        ========================= */}
        <div className="dashboard-hero">
          <div>
            <div className="eyebrow eyebrow-gold">
              EAC MEMBER PORTAL
            </div>

            <h1>
              Welcome,{' '}
              {profile?.full_name ||
                user?.user_metadata?.full_name ||
                'Member'}
              .
            </h1>

            <p>
              Your private EAC space for account information,
              activities and member services.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            <Link className="button button-light" to="/">
              <ArrowRight
                size={16}
                style={{ transform: 'rotate(180deg)' }}
              />
              Back to EAC website
            </Link>

            <button className="button button-light" onClick={logout}>
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>

        {/* =========================
            MAIN DASHBOARD GRID
        ========================= */}
        <div className="dashboard-grid">

          {/* =========================
              MEMBER INFORMATION
          ========================= */}
          <article className="dashboard-card dashboard-card-wide">

            <div className="dashboard-card-icon">
              <User />
            </div>

            <div style={{ width: '100%' }}>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div className="eyebrow">PROFILE</div>
                  <h2>Member information</h2>
                </div>

                {!editingProfile && (
                  <button
                    type="button"
                    className="button button-light"
                    onClick={startEditingProfile}
                  >
                    <Pencil size={15} />
                    Edit profile
                  </button>
                )}
              </div>

              {/* =========================
                  EDIT PROFILE MODE
              ========================= */}
              {editingProfile ? (

                <div
                  style={{
                    display: 'grid',
                    gap: '20px',
                    marginTop: '20px',
                  }}
                >

                  <div className="profile-edit-grid">

                    {/* FULL NAME */}
                    <label>
                      Full name
                      <input
                        type="text"
                        value={profileForm.full_name}
                        onChange={(e) =>
                          handleProfileChange(
                            'full_name',
                            e.target.value
                          )
                        }
                      />
                    </label>

                    {/* MEMBERSHIP TYPE */}
                    <label>
                      Membership type
                      <select
                        value={profileForm.membership_type}
                        onChange={(e) =>
                          handleProfileChange(
                            'membership_type',
                            e.target.value
                          )
                        }
                      >
                        <option value="Student">Student</option>
                        <option value="Staff">Staff</option>
                        <option value="Lecturer">Lecturer</option>
                        <option value="Researcher">
                          Researcher
                        </option>
                        <option value="Engineer">Engineer</option>
                        <option value="Alumni">Alumni</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>

                    {/* AFFILIATION */}
                    <label>
                      Affiliation
                      <input
                        type="text"
                        value={profileForm.affiliation}
                        onChange={(e) =>
                          handleProfileChange(
                            'affiliation',
                            e.target.value
                          )
                        }
                        placeholder="University, organization, etc."
                      />
                    </label>

                    {/* DEPARTMENT */}
                    <label>
                      Department
                      <input
                        type="text"
                        value={profileForm.department}
                        onChange={(e) =>
                          handleProfileChange(
                            'department',
                            e.target.value
                          )
                        }
                        placeholder="Department"
                      />
                    </label>

                    {/* YEAR */}
                    <label>
                      Year / level
                      <input
                        type="text"
                        value={profileForm.year}
                        onChange={(e) =>
                          handleProfileChange(
                            'year',
                            e.target.value
                          )
                        }
                        placeholder="e.g. 4th Year"
                      />
                    </label>

                    {/* PROFESSION */}
                    <label>
                      Profession / role
                      <input
                        type="text"
                        value={profileForm.profession}
                        onChange={(e) =>
                          handleProfileChange(
                            'profession',
                            e.target.value
                          )
                        }
                        placeholder="Profession or role"
                      />
                    </label>

                    {/* INTERESTS */}
                    <label>
                      Areas of interest
                      <input
                        type="text"
                        value={profileForm.interests}
                        onChange={(e) =>
                          handleProfileChange(
                            'interests',
                            e.target.value
                          )
                        }
                        placeholder="e.g. UAV, propulsion, structures"
                      />
                    </label>

                    {/* CONTRIBUTION */}
                    <label>
                      Preferred contribution
                      <input
                        type="text"
                        value={profileForm.preferred_contribution}
                        onChange={(e) =>
                          handleProfileChange(
                            'preferred_contribution',
                            e.target.value
                          )
                        }
                        placeholder="How you would like to contribute"
                      />
                    </label>

                    {/* PHONE */}
                    <label>
                      Phone
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) =>
                          handleProfileChange(
                            'phone',
                            e.target.value
                          )
                        }
                        placeholder="Phone number"
                      />
                    </label>

                    {/* EMAIL - READ ONLY */}
                    <label>
                      Email
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                      />
                      <small style={{ opacity: 0.65 }}>
                        Change your email from Account Security below.
                      </small>
                    </label>

                  </div>

                  {/* ROLE IS INTENTIONALLY NOT EDITABLE */}
                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: 'rgba(15, 45, 75, 0.06)',
                      fontSize: '13px',
                    }}
                  >
                    <strong>Account role:</strong>{' '}
                    <span className="role-badge">
                      {profile?.role || 'member'}
                    </span>

                    <div
                      style={{
                        marginTop: '5px',
                        opacity: 0.65,
                      }}
                    >
                      Your account role is managed by EAC administrators
                      and cannot be changed from this page.
                    </div>
                  </div>

                  {/* SAVE / CANCEL */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      type="button"
                      className="button button-primary"
                      disabled={profileBusy}
                      onClick={saveProfile}
                    >
                      <Save size={15} />
                      {profileBusy
                        ? 'Saving…'
                        : 'Save changes'}
                    </button>

                    <button
                      type="button"
                      className="button button-light"
                      disabled={profileBusy}
                      onClick={cancelEditingProfile}
                    >
                      <X size={15} />
                      Cancel
                    </button>
                  </div>

                </div>

              ) : (

                /* =========================
                   NORMAL PROFILE DISPLAY
                ========================= */
               <div
  className="member-profile-layout"
  style={{
    display:'grid',
    gridTemplateColumns:'minmax(180px,220px) 1fr',
    gap:'24px',
    alignItems:'start',
    marginBottom:'24px',
  }}
>

                  {/* PHOTO */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >

                    <div
                      style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border:
                          '3px solid rgba(212,175,55,.45)',
                        background: '#eef1f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Member profile"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <User
                          size={58}
                          style={{ opacity: 0.35 }}
                        />
                      )}
                    </div>

                    <label
                      className="button button-primary"
                      style={{
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        width: '100%',
                        maxWidth: '180px',
                      }}
                    >
                      <Camera size={16} />
                      Choose photo

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        style={{ display: 'none' }}
                      />
                    </label>

                    {photoFile && (
                      <div
                        style={{
                          width: '100%',
                          maxWidth: '180px',
                          display: 'grid',
                          gap: '8px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '12px',
                            lineHeight: 1.4,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={photoFile.name}
                        >
                          {photoFile.name}
                        </div>

                        <button
                          type="button"
                          className="button button-primary"
                          disabled={photoBusy}
                          onClick={uploadPhoto}
                          style={{
                            width: '100%',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                          }}
                        >
                          <Upload size={15} />
                          {photoBusy
                            ? 'Uploading…'
                            : 'Upload photo'}
                        </button>

                        <button
                          type="button"
                          className="button button-light"
                          disabled={photoBusy}
                          onClick={removeSelectedPhoto}
                          style={{
                            width: '100%',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                          }}
                        >
                          <X size={14} />
                          Cancel
                        </button>
                      </div>
                    )}

                    {!photoFile && profile?.photo_url && (
                      <div
                        style={{
                          fontSize: '12px',
                          opacity: 0.7,
                          textAlign: 'center',
                        }}
                      >
                        Your public member photo
                      </div>
                    )}

                    {photoError && (
                      <div
                        className="form-error"
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                        }}
                      >
                        {photoError}
                      </div>
                    )}
                  </div>

                  {/* PROFILE INFORMATION */}
                  <div className="profile-lines">

                    <div>
                      <span>Name</span>
                      <strong>
                        {profile?.full_name || '—'}
                      </strong>
                    </div>

                    <div>
                      <span>Email</span>
                      <strong>
                        {user?.email || '—'}
                      </strong>
                    </div>

                    <div>
                      <span>Membership type</span>
                      <strong>
                        {profile?.membership_type ||
                          'Student'}
                      </strong>
                    </div>

                    <div>
                      <span>Affiliation</span>
                      <strong>
                        {profile?.affiliation || '—'}
                      </strong>
                    </div>

                    <div>
                      <span>Department</span>
                      <strong>
                        {profile?.department || '—'}
                      </strong>
                    </div>

                    <div>
                      <span>Year / level</span>
                      <strong>
                        {profile?.year || '—'}
                      </strong>
                    </div>

                    <div>
                      <span>Profession / role</span>
                      <strong>
                        {profile?.profession || '—'}
                      </strong>
                    </div>

                    <div>
                      <span>Areas of interest</span>
                      <strong>
                        {profile?.interests || '—'}
                      </strong>
                    </div>

                    <div>
                      <span>Preferred contribution</span>
                      <strong>
                        {profile?.preferred_contribution ||
                          '—'}
                      </strong>
                    </div>

                    <div>
                      <span>Phone</span>
                      <strong>
                        {profile?.phone || '—'}
                      </strong>
                    </div>

                    <div>
                      <span>Role</span>
                      <strong className="role-badge">
                        {profile?.role || 'member'}
                      </strong>
                    </div>

                  </div>
                </div>
              )}

              {/* PROFILE PHOTO MESSAGE */}
              {!editingProfile && (
                <div
                  style={{
                    fontSize: '13px',
                    opacity: 0.72,
                    lineHeight: 1.6,
                  }}
                >
                  Your profile photo will appear on the public
                  EAC member directory. Please use a clear,
                  professional photo.
                </div>
              )}

            </div>
          </article>

          {/* =========================
              ACTIVITIES
          ========================= */}
          <article className="dashboard-card">
            <div className="dashboard-card-icon">
              <CalendarDays />
            </div>

            <div>
              <div className="eyebrow">ACTIVITIES</div>

              <h2>EAC activities</h2>

              <p>
                Explore the public programme, UAV laboratory,
                research areas and confirmed events.
              </p>

              <Link
                className="text-link"
                to="/uav-lab"
              >
                Explore UAV programme{' '}
                <ArrowRight size={15} />
              </Link>
            </div>
          </article>

          {/* =========================
              MEMBERSHIP STATUS
          ========================= */}
          <article className="dashboard-card">
            <div className="dashboard-card-icon">
              <ShieldCheck />
            </div>

            <div>
              <div className="eyebrow">MEMBERSHIP</div>

              <h2>Member status</h2>

              <p>
                Your account is email-authenticated.
                Your membership information can be updated
                from the profile editor.
              </p>

              <span className="status-label">
                <CheckCircle2 size={14} />
                Account active
              </span>
            </div>
          </article>

        </div>

        {/* =========================
            ACCOUNT SECURITY
        ========================= */}
        <div className="security-panel">

          <div className="dashboard-section-title">
            <div>
              <div className="eyebrow">
                ACCOUNT SECURITY
              </div>

              <h2>Manage your sign-in</h2>
            </div>

            <LockKeyhole />
          </div>

          <div className="security-grid">

            {/* CHANGE EMAIL */}
            <div className="settings-card">
              <div className="eyebrow">
                CHANGE EMAIL
              </div>

              <p>
                Your new email must be verified before it
                becomes the trusted account address.
              </p>

              <label>
                New email

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </label>

              <button
                className="button button-primary"
                disabled={
                  busy || email === user?.email
                }
                onClick={changeEmail}
              >
                {busy
                  ? 'Saving…'
                  : 'Change email'}

                <Mail size={15} />
              </button>
            </div>

            {/* CHANGE PASSWORD */}
            <div className="settings-card">
              <div className="eyebrow">
                CHANGE PASSWORD
              </div>

              <p>
                Choose a strong password. You can also use
                the password-reset flow from the login page.
              </p>

              <label>
                New password

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  minLength="8"
                />
              </label>

              <button
                className="button button-primary"
                disabled={
                  busy || password.length < 8
                }
                onClick={changePassword}
              >
                {busy
                  ? 'Saving…'
                  : 'Change password'}

                <LockKeyhole size={15} />
              </button>
            </div>

          </div>

          {/* SUCCESS MESSAGE */}
          {message && (
            <div className="form-success">
              <CheckCircle2 />
              {message}
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}