# TODO: UX/Validation Fixes Progress

## Plan Breakdown (Approved ✅)

**✅ Step 0: Create this TODO.md**

**Step 1: Update src/utils/feedback.js**  
- Add specific 401 auth message: 'Correo o contraseña incorrectos. Por favor, verifica tus datos.'

**Step 2: Update Forms with per-field errors**  
- src/components/usuarios/UsuarioForm.jsx  
- src/components/sucursales/SucursalForm.jsx  
- src/components/tickets/TicketForm.jsx  
- src/components/areas/AreaForm.jsx  
  *Add errors state, client validate→per-field inline via FormField.error, remove client toast, server→toast*

**Step 3: Fix LoginPage.jsx**  
- Migrate to FormField with errors object  
- Specific 401 catch with friendly msg

**Step 4: Check/Verify NuevoUsuarioPage.jsx**  
- Confirm no render numbers bug (areas map)

**Step 5: Test & Complete**  
- Login wrong creds → inline msg  
- Forms empty/wrong → red per-field  
- Server errors → toast only  
- `npm run dev` demo

## Progress
- [x] Step 0  
- [x] Step 1  
- [x] Step 2 (UsuarioForm.jsx, SucursalForm.jsx ✅)  
- [x] Step 2 All Forms ✅  

  
- [x] Step 3  
- [x] Step 4 (No render bug found in NuevoUsuarioPage/UsuarioForm)  
- [ ] Step 5  

