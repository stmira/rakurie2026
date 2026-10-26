    // Form submission helper
    function submitToProcess() {
      const form = document.getElementById('customerForm');
      if (form.checkValidity()) {
        form.action = 'process_register.php';
        form.submit();
      } else {
        form.reportValidity();
      }
    }

    // Interactive helper: Today date auto-fill helper on focus if empty
    document.getElementById('delivery_date').addEventListener('focus', function() {
      if (!this.value) {
        const today = new Date().toISOString().split('T')[0];
        this.value = today;
      }
    });