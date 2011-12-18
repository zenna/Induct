; Can the world continue
; Want to stop if world has stopped or after t-max timesteps
(define can-continue?
	(lambda (current-time state)
		(if (< current-time 10)
			#t
			#f)))
			
			
			
; Return function can-continue?
(define state-queries
	(lambda (query)
		(query)))

; is the agent in an invalid position
(define invalid-pos?
	(lambda (position world-size)
		(and 
			(< (car position) (car world-size))
			(< (cdr position) (cdr world-size)))))

; is the agent on the perimiter?
(define on-perimiter?
	(lambda (position world-size)
		(and
			(or
				(equal? (car position) (car (- world-size 1)))
				(equal? (car position) 0))
			(or
				(equal? (cdr position) (cdr (- world-size 1)))
				(equal? (cdr position) 0)))))

; Model for wicked world
(define test-model
	(lambda (state action state-queries)
		(begin
			(define world-size ((state-queries 'get-world-size) state))
			(define agent-position ((state-queries 'get-agent-pos) state))
			(define new-agent-position ((state-queries 'get-agent-pos) state))
		(define newstate (action state))))

; Create an initial state
(define create-inital-state
	(lambda (size-x size-y startpos-x startpos-y)
		(list size-x size-y startpos-x startpos-y)))
		
; Draw the state to console
(define draw-state
	(lambda (state state-queries)
		(display "")))