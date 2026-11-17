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
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../lib/supabase';

export default function MemberDashboard(){
  const { user, profile, signOut, updatePassword, updateEmail, refreshProfile } = useAuth();

  const [email,setEmail] = useState(user?.email||'');
  const [password,setPassword] = useState('');
  const [message,setMessage] = useState('');
  const [error,setError] = useState('');
  const [busy,setBusy] = useState(false);

  const [photoFile,setPhotoFile] = useState(null);
  const [photoPreview,setPhotoPreview] = useState(profile?.photo_url || '');
  const [photoBusy,setPhotoBusy] = useState(false);
  const [photoError,setPhotoError] = useState('');

  const changeEmail=async()=>{
    setBusy(true);
    setError('');
    setMessage('');

    try{
      await updateEmail(email);
      setMessage('A verification message was sent to your new email address.');
    }catch(e){
      setError(e.message||'Unable to change email.');
    }finally{
      setBusy(false);
    }
  };

  const changePassword=async()=>{
    setBusy(true);
    setError('');
    setMessage('');

    try{
      await updatePassword(password);
      setPassword('');
      setMessage('Password updated successfully.');
    }catch(e){
      setError(e.message||'Unable to update password.');
    }finally{
      setBusy(false);
    }
  };

  const handlePhotoSelect=(e)=>{
    setPhotoError('');
    setMessage('');

    const file=e.target.files?.[0];
    if(!file) return;

    if(!file.type.startsWith('image/')){
      setPhotoError('Please choose an image file.');
      e.target.value='';
      return;
    }

    if(file.size > 5 * 1024 * 1024){
      setPhotoError('Please choose an image smaller than 5 MB.');
      e.target.value='';
      return;
    }

    setPhotoFile(file);

    const reader=new FileReader();
    reader.onload=(event)=>{
      setPhotoPreview(event.target?.result || '');
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedPhoto=()=>{
    setPhotoFile(null);
    setPhotoPreview(profile?.photo_url || '');
    setPhotoError('');
    setMessage('');
  };

  const uploadPhoto=async()=>{
    if(!user?.id || !photoFile){
      setPhotoError('Please choose a photo first.');
      return;
    }

    setPhotoBusy(true);
    setPhotoError('');
    setMessage('');

    try{
      const extension=photoFile.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filePath=`members/${user.id}/${Date.now()}.${extension}`;

      const { error:uploadError }=await supabase.storage
        .from('eac-media')
        .upload(filePath, photoFile, {
          cacheControl:'3600',
          upsert:false,
          contentType:photoFile.type,
        });

      if(uploadError) throw uploadError;

      const { data:publicUrlData }=supabase.storage
        .from('eac-media')
        .getPublicUrl(filePath);

      const photoUrl=publicUrlData?.publicUrl;

      if(!photoUrl){
        throw new Error('Unable to create the public photo URL.');
      }

      const { error:updateError }=await supabase
        .from('profiles')
        .update({
          photo_url:photoUrl,
          updated_at:new Date().toISOString(),
        })
        .eq('id',user.id);

      if(updateError) throw updateError;

      setPhotoFile(null);
      setPhotoPreview(photoUrl);
      setMessage('Profile photo updated successfully.');

      if(refreshProfile){
        await refreshProfile();
      }
    }catch(e){
      setPhotoError(e.message || 'Unable to upload your profile photo.');
    }finally{
      setPhotoBusy(false);
    }
  };

  const logout=async()=>{
    await signOut();
  };

  return (
    <section className="dashboard-page">
      <div className="container">

        <div className="dashboard-hero">
          <div>
            <div className="eyebrow eyebrow-gold">EAC MEMBER PORTAL</div>
            <h1>Welcome, {profile?.full_name || user?.user_metadata?.full_name || 'Member'}.</h1>
            <p>Your private EAC space for account information, activities and member services.</p>
          </div>

          <button className="button button-light" onClick={logout}>
            <LogOut size={16}/> Sign out
          </button>
        </div>

        <div className="dashboard-grid">

          <article className="dashboard-card dashboard-card-wide">

            <div className="dashboard-card-icon">
              <User/>
            </div>

            <div style={{width:'100%'}}>
              <div className="eyebrow">PROFILE</div>
              <h2>Member information</h2>

              <div
                style={{
                  display:'grid',
                  gridTemplateColumns:'minmax(180px,220px) 1fr',
                  gap:'24px',
                  alignItems:'start',
                  marginBottom:'24px',
                }}
              >

                <div
                  style={{
                    display:'flex',
                    flexDirection:'column',
                    alignItems:'center',
                    gap:'12px',
                  }}
                >
                  <div
                    style={{
                      width:'150px',
                      height:'150px',
                      borderRadius:'50%',
                      overflow:'hidden',
                      border:'3px solid rgba(212,175,55,.45)',
                      background:'#eef1f5',
                      display:'flex',
                      alignItems:'center',
                      justifyContent:'center',
                    }}
                  >
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Member profile"
                        style={{
                          width:'100%',
                          height:'100%',
                          objectFit:'cover',
                        }}
                      />
                    ) : (
                      <User size={58} style={{opacity:.35}}/>
                    )}
                  </div>

                  <label
                    className="button button-primary"
                    style={{
                      cursor:'pointer',
                      display:'inline-flex',
                      alignItems:'center',
                      justifyContent:'center',
                      gap:'8px',
                      width:'100%',
                      maxWidth:'180px',
                    }}
                  >
                    <Camera size={16}/>
                    Choose photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      style={{display:'none'}}
                    />
                  </label>

                  {photoFile && (
                    <div style={{width:'100%',maxWidth:'180px',display:'grid',gap:'8px'}}>
                      <div
                        style={{
                          fontSize:'12px',
                          lineHeight:1.4,
                          overflow:'hidden',
                          textOverflow:'ellipsis',
                          whiteSpace:'nowrap',
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
                          width:'100%',
                          display:'inline-flex',
                          alignItems:'center',
                          justifyContent:'center',
                          gap:'8px',
                        }}
                      >
                        <Upload size={15}/>
                        {photoBusy ? 'Uploading…' : 'Upload photo'}
                      </button>

                      <button
                        type="button"
                        className="button button-light"
                        disabled={photoBusy}
                        onClick={removeSelectedPhoto}
                        style={{
                          width:'100%',
                          display:'inline-flex',
                          alignItems:'center',
                          justifyContent:'center',
                          gap:'8px',
                        }}
                      >
                        <X size={14}/>
                        Cancel
                      </button>
                    </div>
                  )}

                  {!photoFile && profile?.photo_url && (
                    <div
                      style={{
                        fontSize:'12px',
                        opacity:.7,
                        textAlign:'center',
                      }}
                    >
                      Your public member photo
                    </div>
                  )}

                  {photoError && (
                    <div
                      className="form-error"
                      style={{width:'100%',boxSizing:'border-box'}}
                    >
                      {photoError}
                    </div>
                  )}
                </div>

                <div className="profile-lines">
                  <div>
                    <span>Name</span>
                    <strong>{profile?.full_name||'—'}</strong>
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>{user?.email||'—'}</strong>
                  </div>

                  <div>
                    <span>Membership type</span>
                    <strong>{profile?.membership_type||'Student'}</strong>
                  </div>

                  <div>
                    <span>Affiliation</span>
                    <strong>{profile?.affiliation||'—'}</strong>
                  </div>

                  <div>
                    <span>Department</span>
                    <strong>{profile?.department||'—'}</strong>
                  </div>

                  <div>
                    <span>Year / level</span>
                    <strong>{profile?.year||'—'}</strong>
                  </div>

                  <div>
                    <span>Profession / role</span>
                    <strong>{profile?.profession||'—'}</strong>
                  </div>

                  <div>
                    <span>Role</span>
                    <strong className="role-badge">{profile?.role||'member'}</strong>
                  </div>
                </div>
              </div>

              <div
                style={{
                  fontSize:'13px',
                  opacity:.72,
                  lineHeight:1.6,
                }}
              >
                Your profile photo will appear on the public EAC member directory.
                Please use a clear, professional photo.
              </div>
            </div>
          </article>

          <article className="dashboard-card">
            <div className="dashboard-card-icon"><CalendarDays/></div>

            <div>
              <div className="eyebrow">ACTIVITIES</div>
              <h2>EAC activities</h2>
              <p>Explore the public programme, UAV laboratory, research areas and confirmed events.</p>

              <Link className="text-link" to="/uav-lab">
                Explore UAV programme <ArrowRight size={15}/>
              </Link>
            </div>
          </article>

          <article className="dashboard-card">
            <div className="dashboard-card-icon"><ShieldCheck/></div>

            <div>
              <div className="eyebrow">MEMBERSHIP</div>
              <h2>Member status</h2>
              <p>Your account is email-authenticated. Additional membership approval workflows can be connected here later.</p>

              <span className="status-label">
                <CheckCircle2 size={14}/> Account active
              </span>
            </div>
          </article>
        </div>

        <div className="security-panel">

          <div className="dashboard-section-title">
            <div>
              <div className="eyebrow">ACCOUNT SECURITY</div>
              <h2>Manage your sign-in</h2>
            </div>

            <LockKeyhole/>
          </div>

          <div className="security-grid">

            <div className="settings-card">
              <div className="eyebrow">CHANGE EMAIL</div>
              <p>Your new email must be verified before it becomes the trusted account address.</p>

              <label>
                New email
                <input
                  type="email"
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                />
              </label>

              <button
                className="button button-primary"
                disabled={busy||email===user?.email}
                onClick={changeEmail}
              >
                {busy?'Saving…':'Change email'}
                <Mail size={15}/>
              </button>
            </div>

            <div className="settings-card">
              <div className="eyebrow">CHANGE PASSWORD</div>
              <p>Choose a strong password. You can also use the password-reset flow from the login page.</p>

              <label>
                New password
                <input
                  type="password"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  minLength="8"
                />
              </label>

              <button
                className="button button-primary"
                disabled={busy||password.length<8}
                onClick={changePassword}
              >
                {busy?'Saving…':'Change password'}
                <LockKeyhole size={15}/>
              </button>
            </div>

          </div>

          {message&&(
            <div className="form-success">
              <CheckCircle2/> {message}
            </div>
          )}

          {error&&(
            <div className="form-error">
              {error}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
