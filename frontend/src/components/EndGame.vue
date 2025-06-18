<template>
    <div class="modal fade" id="endGameModal" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          
          <div class="modal-header">
            <h5 class="modal-title" id="myModalLabel">Games Stats</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          
          <div class="modal-body">
            <div>
                <h3>Great Job!</h3>
                <h5>You scored {{ 3 }} out of 10 on today's quiz!</h5>
                <h5>Next quiz will be available in {{ '3hr' }}!</h5>
            </div> 
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Keep Guessing!</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
    name: 'EndGame',
    data() {
        return {
            
        }
    }
}
</script>