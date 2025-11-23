// src/pages/sign-in/ResetPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const submit = (e) => {
    e?.preventDefault();
    console.log("RESET REQ:", email);
    // TODO: API call to trigger reset email
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-background/60 py-12">
      <div className="w-full px-4">
        <div className="mx-auto max-w-md">
          <div className="bg-card rounded-2xl border-4 border-border p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
                <Icon name="Shield" size={18} className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">Reset Password</h2>
                <div className="text-xs text-text-secondary">Enter your email to receive reset instructions</div>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <input className="w-full border-2 border-border rounded-md py-2 px-3 text-sm" placeholder="EMAIL" value={email} onChange={e => setEmail(e.target.value)} />
              <div className="flex items-center justify-center gap-3 mt-2">
                <Button type="submit" className="bg-primary text-primary-foreground px-6 py-2">SEND RESET LINK</Button>
                <Link to="/signin" className="bg-white border-2 border-border px-4 py-2 rounded-md">BACK TO LOGIN</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
