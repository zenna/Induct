; Kearns et al. Sparse sampling algorihtm
(define sparse-sampling
  (lambda (depth num-samples discount model state 
                 possible-actions state-queries)
    (let
        ((q-star (estimate-q depth num-samples discount
                             model state possible-actions
                             state-queries)))
      (list-ref possible-actions (arg-max (lambda (x) x) q-star)))))

;; Kearns et al. Sparse sampling algorihtm
;(define sparse-sampling
;  (lambda (depth num-samples discount model state 
;                 possible-actions state-queries)
;    (let
;        ((q-star (estimate-q depth num-samples discount
;                             model state possible-actions
;                             state-queries)))
;      q-star)))


; Estimate value
(define estimate-v
  (lambda (depth num-samples discount model state
                 possible-actions state-queries)
    (let 
        ((q-star (estimate-q depth num-samples discount
                             model state possible-actions
                             state-queries)))
      (max-in-list q-star))))

; For each action in possible actions generate C samples
; And compute the reward until max depth
(define estimate-q
  (lambda (depth num-samples discount model state
                 possible-actions state-queries)
    (cond ((zero? depth)
           (list 0))
          (else
           (map (lambda (action)
                  (/ (sum-rewards num-samples
                                  num-samples depth
                                  discount model
                                  state action
                                  possible-actions
                                  state-queries)
                     num-samples))
                possible-actions)))))

; Recursive function to applied to evevery action
(define sum-rewards
  (lambda (sample-num num-samples depth
                      discount model state action
                      possible-actions state-queries)
    (if (zero? sample-num)
        0
        (let ((state-reward (model state action state-queries)))
          (+
           (cdr state-reward)
           (* discount (estimate-v (- depth 1)
                                   num-samples
                                   discount
                                   model state
                                   possible-actions
                                   state-queries))
           (sum-rewards (- sample-num 1) num-samples
                        depth discount
                        model (car state-reward) action
                        possible-actions state-queries))))))