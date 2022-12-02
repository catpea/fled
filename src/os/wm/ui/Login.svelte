<script>
  import { slide, fade } from 'svelte/transition';
  import { db, session } from '../store.js';

  let verifyUser = 'hunter';
  let verifyPass = 'hunter123';

  function authorize(){
    $session.user = verifyUser;
    $session.valid = true;
  }

  setTimeout(authorize,300)

</script>

<style>
.ui-login {

}
</style>

{#if !$session.valid}
  <div transition:fade class="position-absolute d-flex justify-content-center align-items-center w-100 m-auto mt-5">
      <div>
      <h1 class="display-6 text-center mb-3 fw-normal">Login</h1>
      <div class="form-floating">
        <input type="email" class="form-control form-control-sm" id="floatingInput" placeholder="name@example.com" bind:value={verifyUser}>
        <label for="floatingInput">Email address</label>
      </div>
      <div class="form-floating">
        <input type="password" class="form-control form-control-sm" id="floatingPassword" placeholder="Password" bind:value={verifyPass}>
        <label for="floatingPassword">Password</label>
      </div>
      <div class="checkbox my-3">
        <label>
          <input type="checkbox" value="remember-me"> Remember me
        </label>
      </div>
      <button class="w-25 btn btn-sm btn-primary" on:click={authorize}>Sign in</button>
      <p class="mt-5 mb-3 text-muted">© 2017–2022</p>
      </div>
  </div>
{:else}
  <slot/>
{/if}
