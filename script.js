(() => {
  "use strict";

  // Event Date: Sunday, 06 Dec 2026 at 09:00 AM Sri Lanka Time (UTC+05:30)
  const EVENT_TIMESTAMP = new Date("2026-12-06T09:00:00+05:30").getTime();
  const COORDINATOR_PHONE = "94775138838"; // Mr. M.S.M. Ramjan

  const currentLang = document.documentElement.lang || "en";

  /* ==========================================================================
     1. LANGUAGE OPENER MODAL INTERACTION
     ========================================================================== */
  const langOpener = document.getElementById("langOpener");
  const btnChooseEn = document.getElementById("btnChooseEn");
  const bgAudio = document.getElementById("bgAudio");
  const audioBtn = document.getElementById("audioBtn");
  const audioText = document.getElementById("audioText");
  let isPlaying = false;

  function startAudioIfPossible() {
    if (bgAudio && !isPlaying) {
      bgAudio.volume = 0.3;
      bgAudio.play().then(() => {
        isPlaying = true;
        if (audioBtn) audioBtn.classList.add("is-playing");
        if (audioText) {
          audioText.textContent = currentLang === "ta" ? "இசை ஒலி" : (currentLang === "si" ? "වාදනය වේ" : "Playing");
        }
      }).catch(() => {
        isPlaying = false;
      });
    }
  }

  // Dismiss opener when English is clicked
  if (btnChooseEn && langOpener) {
    btnChooseEn.addEventListener("click", () => {
      langOpener.classList.add("is-hidden");
      sessionStorage.setItem("kcc_lang_opened", "true");
      startAudioIfPossible();
    });
  }

  // Check if opener was already dismissed in this session
  if (sessionStorage.getItem("kcc_lang_opened") === "true") {
    if (langOpener) {
      langOpener.classList.add("is-hidden");
    }
  }

  /* ==========================================================================
     2. AUDIO TOGGLE (TOP BAR BUTTON)
     ========================================================================== */
  if (audioBtn && bgAudio) {
    bgAudio.volume = 0.3;

    audioBtn.addEventListener("click", () => {
      if (!isPlaying) {
        bgAudio.play().then(() => {
          isPlaying = true;
          audioBtn.classList.add("is-playing");
          audioText.textContent = currentLang === "ta" ? "இசை ஒலி" : (currentLang === "si" ? "වාදනය වේ" : "Playing");
        }).catch(() => {
          isPlaying = false;
        });
      } else {
        bgAudio.pause();
        isPlaying = false;
        audioBtn.classList.remove("is-playing");
        audioText.textContent = currentLang === "ta" ? "இசை" : (currentLang === "si" ? "සංගීතය" : "Music");
      }
    });
  }

  /* ==========================================================================
     3. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    });

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-revealed"));
  }

  /* ==========================================================================
     4. MOBILE FLOATING ACTION BAR ON SCROLL
     ========================================================================== */
  const mobileFloatBar = document.getElementById("mobileFloatBar");
  if (mobileFloatBar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 380) {
        mobileFloatBar.classList.add("is-visible");
      } else {
        mobileFloatBar.classList.remove("is-visible");
      }
    }, { passive: true });
  }

  /* ==========================================================================
     5. COUNTDOWN TIMER
     ========================================================================== */
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function pad(n, len = 2) {
    return String(n).padStart(len, "0");
  }

  function updateCountdown() {
    const diff = EVENT_TIMESTAMP - Date.now();
    if (diff <= 0) {
      if (daysEl) daysEl.textContent = "000";
      if (hoursEl) hoursEl.textContent = "00";
      if (minutesEl) minutesEl.textContent = "00";
      if (secondsEl) secondsEl.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    if (daysEl) daysEl.textContent = pad(d, 3);
    if (hoursEl) hoursEl.textContent = pad(h);
    if (minutesEl) minutesEl.textContent = pad(m);
    if (secondsEl) secondsEl.textContent = pad(s);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ==========================================================================
     6. DOB & REAL-TIME AGE CALCULATION
     ========================================================================== */
  const dobInput = document.getElementById("dob");
  const ageBadge = document.getElementById("ageBadge");

  function calculateAge(dobStr) {
    if (!dobStr) return null;
    const dob = new Date(dobStr);
    const eventDate = new Date("2026-12-06");
    let age = eventDate.getFullYear() - dob.getFullYear();
    const m = eventDate.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && eventDate.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }

  function updateAge() {
    if (!dobInput || !ageBadge) return;
    const age = calculateAge(dobInput.value);
    const prefix = currentLang === "ta" ? "வயது: " : (currentLang === "si" ? "වයස: " : "Age: ");
    const suffix = currentLang === "ta" ? " ஆண்டுகள்" : (currentLang === "si" ? " වසර" : " Yrs");

    if (age !== null && !isNaN(age)) {
      ageBadge.textContent = `${prefix}${age}${suffix}`;
    } else {
      ageBadge.textContent = `${prefix}—`;
    }
  }

  if (dobInput) {
    dobInput.addEventListener("input", updateAge);
    dobInput.addEventListener("change", updateAge);
    updateAge();
  }

  /* ==========================================================================
     7. SAME AS CONTACT PHONE CHECKBOX
     ========================================================================== */
  const contactInput = document.getElementById("contactNumber");
  const whatsappInput = document.getElementById("whatsappNumber");
  const samePhone = document.getElementById("samePhone");

  if (samePhone && contactInput && whatsappInput) {
    samePhone.addEventListener("change", () => {
      if (samePhone.checked) {
        whatsappInput.value = contactInput.value;
        clearError("wrap-whatsapp", "whatsappError");
      }
    });

    contactInput.addEventListener("input", () => {
      if (samePhone.checked) {
        whatsappInput.value = contactInput.value;
        clearError("wrap-whatsapp", "whatsappError");
      }
    });
  }

  /* ==========================================================================
     8. FORM VALIDATION & SMOOTH MOBILE SCROLL-TO-ERROR
     ========================================================================== */
  const form = document.getElementById("donorForm");
  const pledgeCheck = document.getElementById("pledgeCheck");
  const pledgeContainer = document.getElementById("pledgeContainer");
  const fullName = document.getElementById("fullName");
  const address = document.getElementById("address");
  const bloodGroup = document.getElementById("bloodGroup");
  const timeSlot = document.getElementById("timeSlot");

  const pledgeError = document.getElementById("pledgeError");
  const nameError = document.getElementById("nameError");
  const dobError = document.getElementById("dobError");
  const contactError = document.getElementById("contactError");
  const whatsappError = document.getElementById("whatsappError");
  const addressError = document.getElementById("addressError");

  const submitNotice = document.getElementById("submitNotice");
  const btnSubmitWhatsApp = document.getElementById("btnSubmitWhatsApp");

  function getGender() {
    const r = document.querySelector('input[name="gender"]:checked');
    if (r) return r.value;
    return currentLang === "ta" ? "ஆண்" : (currentLang === "si" ? "පුරුෂ" : "Male");
  }

  function setError(wrapId, errorId, show) {
    const wrap = document.getElementById(wrapId);
    const err = document.getElementById(errorId);
    if (show) {
      if (wrap) wrap.classList.add("has-error");
      if (err) err.classList.add("visible");
    } else {
      if (wrap) wrap.classList.remove("has-error");
      if (err) err.classList.remove("visible");
    }
  }

  function clearError(wrapId, errorId) {
    setError(wrapId, errorId, false);
  }

  if (fullName) fullName.addEventListener("input", () => clearError("wrap-fullName", "nameError"));
  if (dobInput) dobInput.addEventListener("input", () => clearError("wrap-dob", "dobError"));
  if (contactInput) contactInput.addEventListener("input", () => clearError("wrap-contact", "contactError"));
  if (whatsappInput) whatsappInput.addEventListener("input", () => clearError("wrap-whatsapp", "whatsappError"));
  if (address) address.addEventListener("input", () => clearError("wrap-address", "addressError"));
  if (pledgeCheck) {
    pledgeCheck.addEventListener("change", () => {
      if (pledgeCheck.checked) {
        if (pledgeContainer) pledgeContainer.classList.remove("is-unchecked");
        if (pledgeError) pledgeError.classList.remove("visible");
      }
    });
  }

  function validate() {
    let valid = true;
    let firstErrorElement = null;

    // Pledge
    if (!pledgeCheck.checked) {
      if (pledgeContainer) pledgeContainer.classList.add("is-unchecked");
      if (pledgeError) pledgeError.classList.add("visible");
      if (!firstErrorElement) firstErrorElement = pledgeContainer;
      valid = false;
    } else {
      if (pledgeContainer) pledgeContainer.classList.remove("is-unchecked");
      if (pledgeError) pledgeError.classList.remove("visible");
    }

    // Name
    if (!fullName.value.trim()) {
      setError("wrap-fullName", "nameError", true);
      if (!firstErrorElement) firstErrorElement = fullName;
      valid = false;
    } else {
      setError("wrap-fullName", "nameError", false);
    }

    // DOB (Age 18-60)
    const age = calculateAge(dobInput.value);
    if (!dobInput.value || isNaN(age) || age < 18 || age > 65) {
      setError("wrap-dob", "dobError", true);
      if (!firstErrorElement) firstErrorElement = dobInput;
      valid = false;
    } else {
      setError("wrap-dob", "dobError", false);
    }

    // Contact
    if (!contactInput.value.trim() || contactInput.value.trim().length < 9) {
      setError("wrap-contact", "contactError", true);
      if (!firstErrorElement) firstErrorElement = contactInput;
      valid = false;
    } else {
      setError("wrap-contact", "contactError", false);
    }

    // WhatsApp
    if (!whatsappInput.value.trim() || whatsappInput.value.trim().length < 9) {
      setError("wrap-whatsapp", "whatsappError", true);
      if (!firstErrorElement) firstErrorElement = whatsappInput;
      valid = false;
    } else {
      setError("wrap-whatsapp", "whatsappError", false);
    }

    // Address
    if (!address.value.trim()) {
      setError("wrap-address", "addressError", true);
      if (!firstErrorElement) firstErrorElement = address;
      valid = false;
    } else {
      setError("wrap-address", "addressError", false);
    }

    // Smooth scroll to first error field
    if (!valid && firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      if (firstErrorElement.focus) {
        firstErrorElement.focus();
      }
    }

    return valid;
  }

  function getFormData() {
    return {
      name: fullName.value.trim(),
      gender: getGender(),
      dob: dobInput.value,
      age: calculateAge(dobInput.value),
      contact: contactInput.value.trim(),
      whatsapp: whatsappInput.value.trim(),
      address: address.value.trim(),
      bloodGroup: bloodGroup.value,
      slot: timeSlot.value
    };
  }

  // Build WhatsApp pre-filled registration message in respective language
  function buildWhatsAppMessage(data, passId) {
    if (currentLang === "ta") {
      return `*BLOOD DONATION CAMP 2026 — PPA KCC REGISTRATION*
----------------------------------------
*Pass ID:* ${passId}
*Pledge:* Yes, I'm eligible and I'll participate! (ஆம், நான் பங்கேற்பேன்)

*Donor Details (கொடையாளர் விபரம்):*
• *Full Name (பெயர்):* ${data.name}
• *Gender (பாலினம்):* ${data.gender}
• *DOB (பிறந்த திகதி):* ${data.dob} (Age: ${data.age})
• *Contact Number:* ${data.contact}
• *WhatsApp Number:* ${data.whatsapp}
• *Address / Town (முகவரி):* ${data.address}
• *Blood Group:* ${data.bloodGroup}
• *Time Slot (நேரம்):* ${data.slot}

----------------------------------------
*Venue:* College Main Hall, Kalugamuwa Central College
*Location Map:* https://maps.app.goo.gl/GUvWcV5GCEfPuANm7
*Date:* Sunday, 06 Dec 2026 (09:00 AM)`;
    } else if (currentLang === "si") {
      return `*BLOOD DONATION CAMP 2026 — PPA KCC REGISTRATION*
----------------------------------------
*Pass ID:* ${passId}
*Pledge:* Yes, I'm eligible and I'll participate! (ඔව්, මම සහභාගී වෙමි)

*Donor Details (දායකයාගේ විස්තර):*
• *Full Name (නම):* ${data.name}
• *Gender (ස්ත්‍රී/පුරුෂ):* ${data.gender}
• *DOB (උපන් දිනය):* ${data.dob} (Age: ${data.age})
• *Contact Number:* ${data.contact}
• *WhatsApp Number:* ${data.whatsapp}
• *Address / Town (ලිපිනය):* ${data.address}
• *Blood Group:* ${data.bloodGroup}
• *Time Slot (වේලාව):* ${data.slot}

----------------------------------------
*Venue:* College Main Hall, Kalugamuwa Central College
*Location Map:* https://maps.app.goo.gl/GUvWcV5GCEfPuANm7
*Date:* Sunday, 06 Dec 2026 (09:00 AM)`;
    } else {
      return `*BLOOD DONATION REGISTRATION — PPA KCC 2026*
----------------------------------------
*Pass ID:* ${passId}
*Pledge:* Yes, I'm eligible and I'll participate!

*Donor Details:*
• *Name:* ${data.name}
• *Gender:* ${data.gender}
• *DOB:* ${data.dob} (Age: ${data.age})
• *Contact:* ${data.contact}
• *WhatsApp:* ${data.whatsapp}
• *Address:* ${data.address}
• *Blood Group:* ${data.bloodGroup}
• *Preferred Slot:* ${data.slot}

----------------------------------------
*Venue:* College Main Hall, Kalugamuwa Central College
*Location Map:* https://maps.app.goo.gl/GUvWcV5GCEfPuANm7
*Date:* Sunday, 06 Dec 2026 (09:00 AM)`;
    }
  }

  // Handle Sole Registration Form Submission via WhatsApp
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate()) return;

      const submitBtn = btnSubmitWhatsApp || form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.75";
      }

      const data = getFormData();
      const passId = (window.DonorRegistry && typeof window.DonorRegistry.getNextPassId === "function")
        ? window.DonorRegistry.getNextPassId()
        : "#PPA-KCC-BDC-001";

      // Show feedback notice
      if (submitNotice) {
        submitNotice.style.display = "block";
        submitNotice.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      // Automatic In-Built Data Collection (persists locally & syncs to Google Sheets cloud)
      if (window.DonorRegistry && typeof window.DonorRegistry.saveDonor === "function") {
        try {
          await window.DonorRegistry.saveDonor(data, passId, currentLang);
        } catch (err) {
          console.warn("Registry save notice:", err);
        }
      }

      const msg = buildWhatsAppMessage(data, passId);
      const waUrl = `https://wa.me/${COORDINATOR_PHONE}?text=${encodeURIComponent(msg)}`;

      // Launch WhatsApp (support both mobile app scheme and desktop web)
      setTimeout(() => {
        window.open(waUrl, "_blank") || (window.location.href = waUrl);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = "1";
        }
      }, 350);
    });
  }

  /* ==========================================================================
     9. ADD TO CALENDAR (.ICS)
     ========================================================================== */
  const calendarBtn = document.getElementById("calendarBtn");
  if (calendarBtn) {
    calendarBtn.addEventListener("click", () => {
      const summary = currentLang === "ta" 
        ? "இரத்த தான முகாம் 2026 — கழுகமுவ ம.ம.வி பழைய மாணவர் சங்கம்"
        : (currentLang === "si" 
            ? "රුධිර පරිත්‍යාග කඳවුර 2026 — කළුගමුව ම.ම.වි. ආදි ශිෂ්‍ය සංගමය"
            : "PPA KCC Blood Donation Camp 2026");

      const cal = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Inkspire Prints//PPA KCC Blood Donation//EN",
        "BEGIN:VEVENT",
        "UID:kcc-blood-donation-20261206@inkspireprints.lk",
        "DTSTART;TZID=Asia/Colombo:20261206T090000",
        "DTEND;TZID=Asia/Colombo:20261206T150000",
        `SUMMARY:${summary}`,
        "LOCATION:College Main Hall\\, Kalugamuwa Central College\\, Gelioya (https://maps.app.goo.gl/GUvWcV5GCEfPuANm7)",
        "DESCRIPTION:Blood Donation Camp organized by Past Pupils' Association (PPA) of Kalugamuwa Central College. Location: https://maps.app.goo.gl/GUvWcV5GCEfPuANm7",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([cal], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "PPA-KCC-Blood-Donation-2026.ics";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

})();
