; Can the world continue
; Want to stop if world has stopped or after t-max timesteps
(define can-continue?
  (lambda (current-time state)
    (if (< current-time 10)
        #t
        #f)))

; Return position as x,y
(define get-agent-position
  (lambda (state)
    (cons (list-ref state 2) (list-ref state 3))))

; Return size of world
(define get-world-size
  (lambda (state)
    (cons (list-ref state 0) (list-ref state 1))))

; is the agent in an invalid position
(define invalid-pos?
  (lambda (position world-size)
    (and 
     (>= (car position) (car world-size))
     (>= (cdr position) (cdr world-size)))))

; is the agent on the perimiter?
(define on-perimeter?
  (lambda (position world-size)
    (or
     (or
      (equal? (car position) (- (car world-size) 1))
      (equal? (car position) 0))
     (or
      (equal? (cdr position) (- (cdr world-size) 1))
      (equal? (cdr position) 0)))))

; Model for wicked world
(define test-model
  (lambda (state action state-queries)
    (let* ((world-size ((list-ref state-queries 1) state))
           (agent-position ((list-ref state-queries 2) state))
           (agent-new-position
            (cons (cond ((equal? action 'move-right)
                         (+ (car agent-position) 1))
                        ((equal? action 'move-left)
                         (- (car agent-position) 1))
                        (else
                         (car agent-position)))
                  (cond ((equal? action 'move-up)
                         (+ (cdr agent-position) 1))
                        ((equal? action 'move-down)
                         (- (cdr agent-position) 1))
                        (else
                         (cdr agent-position))))))
      (cond ((invalid-pos? agent-new-position world-size)
             (cons '(KEEP CURRENT POSITION) 0.0))
            ((on-perimeter? agent-new-position world-size)
             (cons '(CREATE STATE FROM NEW POSITION) 1.0))
            (else
             (cons '(NO REWARD BUT MOVE) 0.0))))))
	


; Create an initial state
(define create-initial-state
  (lambda (size-x size-y startpos-x startpos-y)
    (list size-x size-y startpos-x startpos-y)))

; Draw the state to console
(define draw-state
  (lambda (state state-queries)
    (display "")))