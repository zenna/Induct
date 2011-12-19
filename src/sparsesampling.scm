; Do sparse sampling into future
; model f(state,action) -> (newsate,reward)
(define argmax
  (lambda (q-stars possible-actions)
    (cdr possible-actions)))
    

; Kearns et al Sparse sampling algorihtm
(define sparse-sampling
  (lambda (model state num-samples)
    (let
        ((q-star (estimate-q depth num-samples discount model state possible-actions)))
      (argmax '(estimate-Q depth num-samples model state possible-actions) action))))

; Estimate value
(define estimate-v
  (lambda (depth num-samples discount model state possible-actions)
    (let 
        ((q-star (estimate-q depth num-samples discount model state possible-actions)))
      (max q-star))))
        
; For each action in possible actions generate C samples
(define estimate-q
  (lambda (depth num-samples model state possible-actions)
    (cond ((zero? depth)
           (list 0))
          (else
           (map (lambda (action)
                  (/ (sum-rewards num-samples model state action gamma)
                     num-samples)
                possible-actions))))))

; Recursive function to 
(define sum-rewards
  (lambda (sample-num model state action gamma)
    (if (zero? sample-num)
        0
        (let ((state-reward (model state action)))
          (+
           (cdr (state-reward))
           (* gamma (estimate-v (- depth 1) num-samples discount model state possible-actions))
           (sum-rewards (- sample-num 1)))))))